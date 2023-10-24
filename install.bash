#!/usr/bin/env bash
if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install gh-red" >&2
  exit 1
fi

set -eu

export GHRED_DATA_HOME="${GHRED_DATA_HOME:-${XDG_DATA_HOME:-${HOME}/.local/share}/gh-red}"

if [[ -d "${GHRED_DATA_HOME}/src" ]]; then
  echo "gh-red is already installed"
  git -C "${GHRED_DATA_HOME}/src" pull
  exit 0
fi

git clone https://github.com/NagayamaRyoga/gh-red "${GHRED_DATA_HOME}/src"
mkdir -p "${GHRED_DATA_HOME}/bin"
ln -sf "${GHRED_DATA_HOME}/src/gh-red" "${GHRED_DATA_HOME}/bin/gh-red"
