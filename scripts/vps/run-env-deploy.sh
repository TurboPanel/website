#!/bin/sh
# Runs as alpha, under flock. Builds via sudo -u website, then reloads Caddy
# and promotes. A failed health check never reloads and never promotes.
set -eu

ENV_NAME=${1-}
SHA=${2-}

if [ -z "${ENV_NAME}" ] || [ -z "${SHA}" ]; then
  echo "usage: run-env-deploy.sh <env> <sha>" >&2
  exit 2
fi

export PATH="${HOME}/.local/bin:/opt/node/current/bin:/usr/bin:/bin"
DEPLOY=/home/website/bin/deploy.sh
CADDYFILE="${HOME}/Caddyfile"

echo "deploy ${ENV_NAME} ${SHA}"
if ! sudo -n -H -u website "${DEPLOY}" "${ENV_NAME}" "${SHA}"; then
  echo "deploy failed; leaving Caddy on the previous color" >&2
  exit 1
fi

caddy reload --config "${CADDYFILE}" --adapter caddyfile
sudo -n -H -u website "${DEPLOY}" --promote "${ENV_NAME}"
echo "promoted ${ENV_NAME}"
