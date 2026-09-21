#!/bin/sh
# Website user: dirs, placeholder upstream snippets, deploy.sh, systemd template,
# and (when the GitHub deploy key works) blue/green clones.
set -eu

if [ "$(id -u)" -eq 0 ]; then
  echo "install-website.sh must run as website, not root" >&2
  exit 1
fi

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
GIT_REMOTE=git@github.com:TurboPanel/website.git

mkdir -p \
  "${HOME}/bin" \
  "${HOME}/run" \
  "${HOME}/.config/systemd/user" \
  "${HOME}/sites/testing" \
  "${HOME}/sites/staging" \
  "${HOME}/sites/live"

install -m 0750 "${here}/deploy.sh" "${HOME}/bin/deploy.sh"
install -m 0640 "${here}/systemd/website@.service" \
  "${HOME}/.config/systemd/user/website@.service"

write_placeholder() {
  env_name=$1
  port=$2
  snippet="${HOME}/sites/${env_name}/upstream"
  if [ -f "${snippet}" ]; then
    return 0
  fi
  printf 'reverse_proxy 127.0.0.1:%s\n' "${port}" >"${snippet}"
  chmod 0640 "${snippet}"
}

write_placeholder testing 3001
write_placeholder staging 3003
write_placeholder live 3005

clone_color() {
  env_name=$1
  color=$2
  dest="${HOME}/sites/${env_name}/${color}"
  if [ -d "${dest}/.git" ]; then
    echo "clone already present: ${dest}"
    return 0
  fi
  git clone "${GIT_REMOTE}" "${dest}"
}

if git ls-remote "${GIT_REMOTE}" HEAD >/dev/null 2>&1; then
  clone_color testing blue
  clone_color testing green
  clone_color staging blue
  clone_color staging green
  clone_color live blue
  clone_color live green
else
  echo "GitHub deploy key not usable yet — skip clones (git ls-remote failed)" >&2
fi

systemctl --user daemon-reload
echo "Units: website@testing-blue … website@live-green (started by deploy.sh)"
