#!/bin/sh
# Alpha user: install Caddyfile, hook, user units, HMAC secret placeholder.
set -eu

if [ "$(id -u)" -eq 0 ]; then
  echo "install-alpha.sh must run as alpha, not root" >&2
  exit 1
fi

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

mkdir -p \
  "${HOME}/.local/bin" \
  "${HOME}/.local/share/caddy" \
  "${HOME}/.config/alpha" \
  "${HOME}/.config/systemd/user" \
  "${HOME}/bin" \
  "${HOME}/locks"
chmod 0700 "${HOME}/.config/alpha" "${HOME}/locks"

install -m 0640 "${here}/Caddyfile" "${HOME}/Caddyfile"
install -m 0750 "${here}/hook.mjs" "${HOME}/bin/hook.mjs"
install -m 0750 "${here}/run-env-deploy.sh" "${HOME}/bin/run-env-deploy.sh"
install -m 0640 "${here}/systemd/caddy.service" "${HOME}/.config/systemd/user/caddy.service"
install -m 0640 "${here}/systemd/hook.service" "${HOME}/.config/systemd/user/hook.service"

hook_env="${HOME}/.config/alpha/hook.env"
if [ ! -f "${hook_env}" ]; then
  secret=$(openssl rand -hex 32)
  umask 077
  printf 'GITHUB_WEBHOOK_SECRET=%s\n' "${secret}" >"${hook_env}"
  chmod 0600 "${hook_env}"
  echo "Wrote ${hook_env} — paste GITHUB_WEBHOOK_SECRET into the GitHub webhook"
else
  echo "Keeping existing ${hook_env}"
fi

systemctl --user daemon-reload
echo "Enable with: systemctl --user enable --now caddy.service hook.service"
echo "Root must: setcap cap_net_bind_service=+ep ${HOME}/.local/bin/caddy"
