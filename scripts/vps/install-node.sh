#!/bin/sh
# Root: extract official Node 26.7.0 to /opt/node and enable the hashed pnpm pin.
# Same version as website CI and the daemon node-runtime role.
set -eu

NODE_VERSION=26.7.0
COREPACK_VERSION=0.36.0
# package.json packageManager (keep in step).
PNPM_PREPARE='pnpm@12.3.4+sha512.961aa41fb077da3a04a441d9f8e15ebc0c96da8ef710b2eb67bf9ee7cb0610eabd48f1fd85f51cffe73846785fa0f87c56a3a872a1d893f8446741b5cce45457'

NODE_PREFIX=/opt/node
VERSION_DIR="${NODE_PREFIX}/v${NODE_VERSION}"
CURRENT_LINK="${NODE_PREFIX}/current"

# nodejs.org/dist SHASUMS256.txt (linux-x64 / linux-arm64 tarballs).
NODE_SHA256_X64=bd6b6c31e377bad9ad579bed72e5bc11f4c879ac9452ad51d30e646ea3d828df
NODE_SHA256_ARM64=925aa6157dd37542d0d7f2e28b7bf61e7b39284411210b0498bc3788db4aef68
COREPACK_SHA256=9128cfe26aee0c99f4fc68c15c6b8b12309a68be0de2c012cdfea2a463cb722f

if [ "$(id -u)" -ne 0 ]; then
  echo "install-node.sh must run as root" >&2
  exit 1
fi

uname_m=$(uname -m)
case "${uname_m}" in
  x86_64)
    node_arch=x64
    node_sha=${NODE_SHA256_X64}
    ;;
  aarch64)
    node_arch=arm64
    node_sha=${NODE_SHA256_ARM64}
    ;;
  *)
    echo "unsupported architecture: ${uname_m}" >&2
    exit 1
    ;;
esac

tarball="node-v${NODE_VERSION}-linux-${node_arch}.tar.gz"
url="https://nodejs.org/dist/v${NODE_VERSION}/${tarball}"

if [ -x "${VERSION_DIR}/bin/node" ]; then
  echo "Node ${NODE_VERSION} already present at ${VERSION_DIR}"
else
  tmp=$(mktemp -d)
  trap 'rm -rf "${tmp}"' EXIT
  echo "Downloading ${url}"
  curl --proto "=https" --tlsv1.2 -fsSL -o "${tmp}/${tarball}" "${url}"
  actual=$(sha256sum "${tmp}/${tarball}" | awk '{print $1}')
  if [ "${actual}" != "${node_sha}" ]; then
    echo "Node tarball checksum mismatch (got ${actual})" >&2
    exit 1
  fi
  mkdir -p "${NODE_PREFIX}"
  tar -xzf "${tmp}/${tarball}" -C "${tmp}"
  extracted="${tmp}/node-v${NODE_VERSION}-linux-${node_arch}"
  rm -rf "${VERSION_DIR}"
  mv "${extracted}" "${VERSION_DIR}"
  trap - EXIT
  rm -rf "${tmp}"
fi

ln -sfn "v${NODE_VERSION}" "${CURRENT_LINK}"
chmod -R a+rX "${NODE_PREFIX}"

export PATH="${VERSION_DIR}/bin:${PATH}"
export COREPACK_DEFAULT_TO_LATEST=0
export COREPACK_ENABLE_AUTO_PIN=0

corepack_tgz="${VERSION_DIR}/lib/corepack-${COREPACK_VERSION}.tgz"
if [ ! -x "${VERSION_DIR}/bin/corepack" ]; then
  tmp=$(mktemp -d)
  trap 'rm -rf "${tmp}"' EXIT
  curl --proto "=https" --tlsv1.2 -fsSL -o "${tmp}/corepack.tgz" \
    "https://registry.npmjs.org/corepack/-/corepack-${COREPACK_VERSION}.tgz"
  actual=$(sha256sum "${tmp}/corepack.tgz" | awk '{print $1}')
  if [ "${actual}" != "${COREPACK_SHA256}" ]; then
    echo "corepack tarball checksum mismatch (got ${actual})" >&2
    exit 1
  fi
  install -m 0644 "${tmp}/corepack.tgz" "${corepack_tgz}"
  npm install -g --prefix "${VERSION_DIR}" --no-fund --no-audit --ignore-scripts "${corepack_tgz}"
  trap - EXIT
  rm -rf "${tmp}"
fi

corepack enable
corepack prepare "${PNPM_PREPARE}" --activate

echo "Node $(node --version) at ${CURRENT_LINK} (pnpm $(pnpm --version))"
