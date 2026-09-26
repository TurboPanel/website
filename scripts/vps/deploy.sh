#!/bin/sh
# Blue-green Next deploy as user website. See scripts/vps/README.md.
set -eu

export PATH=/opt/node/current/bin:${PATH}
export COREPACK_DEFAULT_TO_LATEST=0
export COREPACK_ENABLE_AUTO_PIN=0
export NEXT_TELEMETRY_DISABLED=1
export TURBOPANEL_SKIP_TS_CHECK=1
# 1 GiB RAM + swap: default heap is ~480 MiB and `next build` tsc OOMs.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1024}"
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"

HOME_DIR=${HOME:-/home/website}
SITES="${HOME_DIR}/sites"
RUN_DIR="${HOME_DIR}/run"
GIT_REMOTE=git@github.com:TurboPanel/website.git

site_url_for() {
  case "$1" in
    testing) printf '%s' 'https://testing.turbopanel.io' ;;
    staging) printf '%s' 'https://staging.turbopanel.io' ;;
    live) printf '%s' 'https://turbopanel.io' ;;
    *) return 1 ;;
  esac
}

blue_port_for() {
  case "$1" in
    testing) printf '%s' '3001' ;;
    staging) printf '%s' '3003' ;;
    live) printf '%s' '3005' ;;
    *) return 1 ;;
  esac
}

green_port_for() {
  case "$1" in
    testing) printf '%s' '3002' ;;
    staging) printf '%s' '3004' ;;
    live) printf '%s' '3006' ;;
    *) return 1 ;;
  esac
}

port_for() {
  env_name=$1
  color=$2
  if [ "${color}" = blue ]; then
    blue_port_for "${env_name}"
  else
    green_port_for "${env_name}"
  fi
}

other_color() {
  color=$1
  if [ "${color}" = blue ]; then
    printf '%s' green
  else
    printf '%s' blue
  fi
}

current_color() {
  env_dir="${SITES}/$1"
  if [ -L "${env_dir}/current" ]; then
    basename "$(readlink "${env_dir}/current")"
  fi
}

idle_color_for() {
  current=$(current_color "$1")
  if [ -z "${current}" ]; then
    printf '%s' blue
    return
  fi
  other_color "${current}"
}

write_upstream() {
  env_name=$1
  port=$2
  snippet="${SITES}/${env_name}/upstream"
  tmp="${snippet}.tmp"
  printf 'reverse_proxy 127.0.0.1:%s\n' "${port}" >"${tmp}"
  chmod 0640 "${tmp}"
  mv "${tmp}" "${snippet}"
}

fold_standalone() {
  clone=$1
  dest=$2
  standalone="${clone}/.next/standalone"
  if [ ! -f "${standalone}/server.js" ]; then
    echo "missing ${standalone}/server.js" >&2
    return 1
  fi
  rm -rf "${dest}.new"
  mkdir -p "${dest}.new"
  cp -a "${standalone}/." "${dest}.new/"
  if [ -d "${clone}/public" ]; then
    rm -rf "${dest}.new/public"
    cp -a "${clone}/public" "${dest}.new/public"
  fi
  mkdir -p "${dest}.new/.next"
  rm -rf "${dest}.new/.next/static"
  cp -a "${clone}/.next/static" "${dest}.new/.next/static"
  rm -rf "${dest}"
  mv "${dest}.new" "${dest}"
}

wait_health() {
  port=$1
  i=0
  while [ "${i}" -lt 60 ]; do
    if curl -fsS --max-time 2 "http://127.0.0.1:${port}/health" >/dev/null 2>&1; then
      return 0
    fi
    i=$((i + 1))
    sleep 1
  done
  return 1
}

promote_env() {
  env_name=$1
  pending="${SITES}/${env_name}/pending"
  if [ ! -f "${pending}" ]; then
    echo "nothing to promote for ${env_name}"
    return 0
  fi
  idle=$(cat "${pending}")
  prev=$(current_color "${env_name}")
  if [ -n "${prev}" ] && [ "${prev}" != "${idle}" ]; then
    systemctl --user stop "website@${env_name}-${prev}.service" || true
  fi
  ln -sfn "${idle}" "${SITES}/${env_name}/current"
  rm -f "${pending}"
}

build_idle() {
  env_name=$1
  sha=$2
  site_url=$(site_url_for "${env_name}")
  idle=$(idle_color_for "${env_name}")
  port=$(port_for "${env_name}" "${idle}")
  clone="${SITES}/${env_name}/${idle}"
  instance="${env_name}-${idle}"
  dest="${RUN_DIR}/${instance}"

  if [ ! -d "${clone}/.git" ]; then
    git clone "${GIT_REMOTE}" "${clone}"
  fi
  git -C "${clone}" fetch --prune origin
  git -C "${clone}" reset --hard "${sha}"
  git -C "${clone}" clean -fdx

  # CI already typechecked this commit (run-env-deploy.sh's ci-gate waits
  # for it); next.config.js skips Next's in-process tsc when
  # TURBOPANEL_SKIP_TS_CHECK=1 (exported above) on this 1 GiB host.

  (
    cd "${clone}"
    export NEXT_PUBLIC_SITE_URL=${site_url}
    pnpm install --frozen-lockfile
    pnpm build
  )

  systemctl --user stop "website@${instance}.service" || true
  fold_standalone "${clone}" "${dest}"
  printf 'PORT=%s\nHOSTNAME=127.0.0.1\nNODE_ENV=production\n' "${port}" >"${dest}.env"
  chmod 0640 "${dest}.env"

  systemctl --user start "website@${instance}.service"
  if ! wait_health "${port}"; then
    echo "health check failed on 127.0.0.1:${port}" >&2
    systemctl --user stop "website@${instance}.service" || true
    return 1
  fi

  write_upstream "${env_name}" "${port}"
  printf '%s\n' "${idle}" >"${SITES}/${env_name}/pending"
  echo "idle ${instance} healthy on ${port}"
}

usage() {
  echo "usage: deploy.sh <env> <sha> | deploy.sh --promote <env>" >&2
  exit 2
}

if [ "${1-}" = --promote ]; then
  ENV_NAME=${2-}
  [ -n "${ENV_NAME}" ] || usage
  site_url_for "${ENV_NAME}" >/dev/null
  promote_env "${ENV_NAME}"
  exit 0
fi

ENV_NAME=${1-}
SHA=${2-}
[ -n "${ENV_NAME}" ] && [ -n "${SHA}" ] || usage
site_url_for "${ENV_NAME}" >/dev/null
build_idle "${ENV_NAME}" "${SHA}"
