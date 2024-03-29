# gh-red

GitHub Releases binaries installer.

## Requirements

- [Deno](https://deno.com/) v1.40 or later
- (tar)
- (unzip)

## Installation

```sh
$ curl -fsSL https://raw.githubusercontent.com/NagayamaRyoga/gh-red/main/install.bash | /bin/bash
$ export PATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/bin:$PATH"
$ export FPATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/completions:$FPATH"
$ export MANPATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/man:$MANPATH"
```

Install as [`gh`](https://github.com/cli/cli) extension:

```sh
$ gh extension install NagayamaRyoga/gh-red
$ export PATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/bin:$PATH"
$ export FPATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/completions:$FPATH"
$ export MANPATH="${XDG_DATA_HOME:-$HOME/.local/share}/gh-red/man:$MANPATH"
```

## Usage

`~/.config/gh-red/config.ts`:

```ts
import { defineConfig } from "https://raw.githubusercontent.com/NagayamaRyoga/gh-red/main/src/config/types.ts";

export default defineConfig({
  tools: [
    {
      name: "junegunn/fzf",
    },
    {
      name: "BurntSushi/ripgrep",
      executables: [
        { glob: "**/rg", as: "rg" },
      ],
    },
    {
      name: "direnv/direnv",
      rename: [
        { from: "direnv*", to: "direnv", chmod: 0o755 },
      ],
    },
    {
      name: "sharkdp/bat",
      completions: [
        { glob: "**/autocomplete/bat.zsh", as: "_bat" },
      ],
    },
    {
      name: "cli/cli",
      async onDownload({ bin: { gh }, $ }) {
        await $`${gh} completion --shell zsh >_gh`;
      },
    },
  ],
});
```

```sh
$ gh-red
Installing junegunn/fzf...
Installing BurntSushi/ripgrep...
Installing direnv/direnv...
Installing sharkdp/bat...
Installing cli/cli...
...

$ where fzf
<home>/.local/share/gh-red/bin/fzf
```

## Related projects

- [zdharma-continuum/zinit](https://github.com/zdharma-continuum/zinit)
- [redraw/gh-install](https://github.com/redraw/gh-install)
