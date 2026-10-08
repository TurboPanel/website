#!/usr/bin/env sh
# Regenerates THIRD_PARTY_NOTICES.md inside a Linux container so it matches
# CI. A notices file generated on macOS lists different platform packages
# than the Linux check.

set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$root"

notices_cmd=notices:generate
case ${1-} in
  (--check) notices_cmd=notices:check ;;
  ('') ;;
  (*) printf '%s\n' "Usage: $0 [--check]" >&2; exit 1 ;;
esac

if command -v docker >/dev/null 2>&1; then
  runtime=docker
elif command -v podman >/dev/null 2>&1; then
  runtime=podman
else
  printf '%s\n' 'Needs a container runtime (docker or podman) installed and running.' >&2
  exit 1
fi

node_ver=$(grep 'node-version:' .github/workflows/verify.yml | sed 's/.*node-version: *"\([^"]*\)".*/\1/' | head -n 1)
pnpm_ver=$(grep '"packageManager"' package.json | sed 's/.*"pnpm@\([^"+]*\).*/\1/')

"$runtime" run --rm \
  -v "$root:/work" \
  -v /work/node_modules \
  -w /work \
  -e "PNPM_VERSION=$pnpm_ver" \
  -e "NOTICES_CMD=$notices_cmd" \
  "node:$node_ver" \
  sh -c '
    set -eu
    if command -v corepack >/dev/null 2>&1; then
      corepack enable
      corepack prepare "pnpm@$PNPM_VERSION" --activate
    else
      npm i -g "pnpm@$PNPM_VERSION"
    fi
    pnpm install --frozen-lockfile
    pnpm "$NOTICES_CMD"
  '

git status --short THIRD_PARTY_NOTICES.md
