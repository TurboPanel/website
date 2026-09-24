#!/bin/sh
# Alpha user: install pinned Caddy 2.11.4 into ~/.local/bin/caddy.
# Root must then: setcap cap_net_bind_service=+ep /home/alpha/.local/bin/caddy
set -eu

CADDY_VERSION=2.11.4
# Official GitHub checksums.txt (SHA-512) for linux amd64 / arm64 tarballs.
CADDY_SHA512_AMD64=8220d1f013b6f27510247b2360c9e0ca9f018feebd82515f07635318b34ff9777ccc8fd0b6e6f2486ce3a33fe389fbb7db12d05baa474f4587509fb4f5ebf1c9
CADDY_SHA512_ARM64=d5a7c423853c24a799765e0e8210d5c7c22a8f56ed37a3cae2fb9f58be138853c02b4efd6b59d576e6d8c7c0d30b9c1592deeaa6a536ff69bcca23b8c1ea709c

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
curl --proto "=https" --tlsv1.2 -fsSL -o "${tmp}/${asset}" "${url}"
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
