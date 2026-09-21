#!/bin/sh
# Alpha user: install pinned Caddy 2.10.2 into ~/.local/bin/caddy.
# Root must then: setcap cap_net_bind_service=+ep /home/alpha/.local/bin/caddy
set -eu

CADDY_VERSION=2.10.2
# Official GitHub checksums.txt (SHA-512) for linux amd64 / arm64 tarballs.
CADDY_SHA512_AMD64=747df7ee74de188485157a383633a1a963fd9233b71fbb4a69ddcbcc589ce4e2cc82dacf5dbbe136cb51d17e14c59daeb5d9bc92487610b0f3b93680b2646546
CADDY_SHA512_ARM64=6ce061a690312ab38367df3c5d5f89a2e4a263e7300d300d87356211bb81e79b15933e6d6203e03fbf26f15cc0311f264805f336147dbdd24938d84b57a4421c

if [ "$(id -u)" -eq 0 ]; then
  echo "install-caddy.sh must run as alpha, not root" >&2
  exit 1
fi

uname_m=$(uname -m)
case "${uname_m}" in
  x86_64)
    caddy_arch=amd64
    caddy_sha=${CADDY_SHA512_AMD64}
    ;;
  aarch64)
    caddy_arch=arm64
    caddy_sha=${CADDY_SHA512_ARM64}
    ;;
  *)
    echo "unsupported architecture: ${uname_m}" >&2
    exit 1
    ;;
esac

dest="${HOME}/.local/bin/caddy"
asset="caddy_${CADDY_VERSION}_linux_${caddy_arch}.tar.gz"
url="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/${asset}"

if [ -x "${dest}" ]; then
  echo "Caddy already present at ${dest}"
  "${dest}" version
  echo "Root must keep: setcap cap_net_bind_service=+ep ${dest}"
  exit 0
fi

tmp=$(mktemp -d)
trap 'rm -rf "${tmp}"' EXIT
echo "Downloading ${url}"
curl -fsSL -o "${tmp}/${asset}" "${url}"
actual=$(sha512sum "${tmp}/${asset}" | awk '{print $1}')
if [ "${actual}" != "${caddy_sha}" ]; then
  echo "Caddy tarball checksum mismatch (got ${actual})" >&2
  exit 1
fi
tar -xzf "${tmp}/${asset}" -C "${tmp}" caddy
install -d "${HOME}/.local/bin"
install -m 0750 "${tmp}/caddy" "${dest}"
"${dest}" version
echo "Root must run: setcap cap_net_bind_service=+ep ${dest}"
