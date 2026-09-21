# VPS hosting (`alpha.turbopanel.net`)

Vanilla Next.js 16 (`output: 'standalone'`) behind Caddy with Let's Encrypt. Stopgap until the marketing site is a TurboPanel native app. Copy these files onto the box; a push to `trunk` does **not** update them.

## Users

| User | Owns |
| --- | --- |
| **`alpha`** | Caddy (`:80`/`:443`), Let's Encrypt (`noc@turbopanel.io`), webhook HMAC secret, hook on `127.0.0.1:8790` |
| **`website`** | Git clones, Next builds, blue-green units. Never reads `hook.env` |

Shared Node **26.7.0** at `/opt/node/current`.

## Branch map

| Git branch | Hostname | Ports (blue / green) |
| --- | --- | --- |
| `trunk` | `testing.turbopanel.io` | 3001 / 3002 |
| `staging` | `staging.turbopanel.io` | 3003 / 3004 |
| `live` | `turbopanel.io` (`www` 301 → apex) | 3005 / 3006 |

Webhook: `https://alpha.turbopanel.net/hooks/github`

## Once, as root

1. `adduser alpha` and `adduser website` — homes, no password login. `/home/website` must be **`0750 website:website`**
2. `usermod -aG website alpha`, then restart alpha's lingering user manager (or reboot) so Caddy picks up the group
3. `loginctl enable-linger alpha` and `loginctl enable-linger website`
4. Firewall: 22 / 80 / 443. Next and the hook bind loopback only
5. `sh scripts/vps/install-node.sh` (this file, from a checkout) — extracts Node to `/opt/node`
6. After alpha installs Caddy: `setcap cap_net_bind_service=+ep /home/alpha/.local/bin/caddy`
7. Install `scripts/vps/sudoers.alpha-website` as `/etc/sudoers.d/alpha-website` (`visudo -c -f` first)

## As `alpha`

```sh
sh scripts/vps/install-caddy.sh
sh scripts/vps/install-alpha.sh
```

`install-alpha.sh` copies the Caddyfile, hook, and user units, and writes `/home/alpha/.config/alpha/hook.env` (`0600`) if missing. Paste that secret into the GitHub webhook settings.

Then as root: `setcap cap_net_bind_service=+ep /home/alpha/.local/bin/caddy`

```sh
systemctl --user enable --now caddy.service hook.service
```

Confirm `https://alpha.turbopanel.net/health` before moving marketing DNS. Marketing site blocks in the Caddyfile log ACME failures until those A/AAAA records point here — expected.

## As `website`

Generate a **read-only** GitHub deploy key (`ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ''`) and add it on `TurboPanel/website`. Then:

```sh
sh scripts/vps/install-website.sh
```

Clones `sites/<env>/{blue,green}` from `git@github.com:TurboPanel/website.git` and installs `bin/deploy.sh` plus the `website@.service` template.

## GitHub

- Webhook payload URL: `https://alpha.turbopanel.net/hooks/github`
- Content type: `application/json`
- Secret: value of `GITHUB_WEBHOOK_SECRET` in alpha's `hook.env`
- Events: **Just the push event**
- Protect `live` so only CI-green merges land there

## Blue-green

`deploy.sh <env> <sha>` builds the idle color, probes `/health`, writes the Caddy `upstream` snippet, and leaves the old color running. Alpha then `caddy reload` and `deploy.sh --promote <env>` stops the previous color. A failed health check never rewrites the snippet and never reloads Caddy.

`NEXT_PUBLIC_SITE_URL` is set at **build** time inside `deploy.sh`. Do not put it on the systemd unit.
