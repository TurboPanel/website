# Production Hosting Scripts (`scripts/vps/`) — AGENTS.md

Repo context: `../../AGENTS.md`.

## Production hosting (`alpha.turbopanel.net`)

Vanilla Next.js 16 (`output: 'standalone'`, `node server.js`) behind Caddy with Let's Encrypt. Stopgap until the marketing site can be a TurboPanel native app. **Not** Cloudflare Workers / OpenNext.

Two Linux users on the box:

| User | Owns |
| --- | --- |
| **`alpha`** | Caddy, Let's Encrypt (`noc@turbopanel.io`), `alpha.turbopanel.net`, webhook HMAC secret, hook on `127.0.0.1:8790` |
| **`website`** | Git clones, Next builds, three blue-green environments. Never reads `hook.env` |

Shared Node **26.7.0** at `/opt/node/current` (same pin as CI). Scripts live in [`scripts/vps/`](./scripts/vps/README.md).

**Branch map:** `trunk` → `testing.turbopanel.io`; `staging` → `staging.turbopanel.io`; `live` → `turbopanel.io` (`www` 301 to apex). GitHub push webhook: `https://alpha.turbopanel.net/hooks/github`.

`NEXT_PUBLIC_SITE_URL` is injected at **`pnpm build`** time inside `deploy.sh`. It is not a systemd runtime env — Next inlines `NEXT_PUBLIC_*` into the client bundle. The VPS is **1 GiB RAM**; `deploy.sh` sets `TURBOPANEL_SKIP_TS_CHECK=1` and a 1024 MiB Node heap so `next build` does not OOM during tsc (GitHub `verify` already typechecks, and `run-env-deploy.sh` waits for it: `scripts/vps/ci-gate.mjs` deploys a pushed SHA only after its required checks pass). The webhook logic (`hook-lib.mjs`: HMAC, push mapping, delivery-id replay guard) and the gate logic (`ci-gate-lib.mjs`) are unit-tested and counted in coverage; only the two entry scripts are excluded. CI runs `sh scripts/scan-secrets.sh --all` (every tracked file).

Co-located Vagrant still runs `next dev` on `:19820` (`turbopanel-website.service`). Do not point contributor Vagrant at the VPS.
