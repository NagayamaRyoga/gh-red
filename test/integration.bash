#!/usr/bin/env bash
set -euxo pipefail

_cputype="$(uname -m)"
case $_cputype in
  aarch64 | arm64)
    _cputype=aarch64
    ;;

  x86_64 | x86-64 | x64 | amd64)
    _cputype=x86_64
    ;;
esac

export DIR="$(cd -- "$(dirname -- "$0")" && pwd)"

export GHRED_CONFIG_FILE="$DIR/config.ts"
export GHRED_DATA_HOME="$DIR/tmp/local/share/gh-red"
export GHRED_STATE_HOME="$DIR/tmp/local/state/gh-red"

test-command() {
  local cmd="$1"
  [[ "$(command -v "$cmd")" = "$GHRED_DATA_HOME/bin/$cmd" ]]
}

test-completion() {
  local cmd="$1"
  [[ -f "$GHRED_DATA_HOME/completions/_$cmd" ]]
}

# Install gh-red
/bin/bash "$DIR/../install.bash"
[[ -n "${GITHUB_SHA:-}" ]] && git -C "$GHRED_DATA_HOME/src" switch -d "$GITHUB_SHA"

export PATH="$GHRED_DATA_HOME/bin:$PATH"

test-command gh-red

# Install binaries
gh-red

[[ -d "$GHRED_DATA_HOME/packages" ]]
[[ -d "$GHRED_DATA_HOME/bin" ]]
[[ -d "$GHRED_DATA_HOME/completions" ]]
[[ -f "$GHRED_STATE_HOME/state.yaml" ]]

# Test binaries
{ # sheldon
  test-command sheldon
  sheldon --version
  [[ -f "$GHRED_DATA_HOME/completions/_sheldon" ]]
}
{ # jargon
  test-command jargon
  jargon --help
  [[ -f "$GHRED_DATA_HOME/packages/github.com/NagayamaRyoga/jargon/jargon.zsh" ]]
}
{ # direnv
  test-command direnv
  direnv --version
  [[ -f "$GHRED_DATA_HOME/packages/github.com/direnv/direnv/direnv.zsh" ]]
}
{ # delta
  test-command delta
  delta --version
}
{ # mmv
  test-command mmv
  mmv --version
}
{ # ripgrep
  test-command rg
  rg --version
}
{ # ghq
  test-command ghq
  test-completion ghq
  ghq --version
}
{ # lazygit
  test-command lazygit
  lazygit --version
}
{ # gh
  test-command gh
  test-completion gh
  gh --version
}
{ # eza
  if [[ "$OSTYPE" != darwin* ]]; then
    test-command eza
    test-completion eza
    eza --version
  else
    ! test-command eza
  fi
}
{ # yq
  test-command yq
  test-completion yq
  yq --version
}
{ # hgrep
  test-command hgrep
  test-completion hgrep
  hgrep --version
}
{ # navi
  test-command navi
  navi --version
}
{ # tealdeer
  test-command tldr
  test-completion tldr
  tldr --version
}
{ # fzf
  test-command fzf
  test-completion fzf
  fzf --version
}
{ # bat
  test-command bat
  test-completion bat
  bat --version
}
{ # fd
  test-command fd
  test-completion fd
  fd --version
}
{ # tokei
  test-command tokei
  tokei --version
}
{ # neovim
  if [[ "$_cputype" = x86_64 ]]; then
    test-command nvim
    nvim --version
  else
    ! test-command nvim
  fi
}
