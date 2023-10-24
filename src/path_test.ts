import { assertEquals } from "std/assert/assert_equals.ts";
import { stub } from "std/testing/mock.ts";
import {
  getBinDir,
  getCompletionsDir,
  getConfigPath,
  getPackageDir,
  getPackagesDir,
  getStatePath,
} from "./path.ts";

function spyEnvGet(
  env: Partial<Record<string, string>>,
) {
  return stub(
    Deno.env,
    "get",
    (key) => env[key],
  );
}

Deno.test(async function testPaths(t) {
  type Test = {
    description: string;
    env: Partial<Record<string, string>>;
    fn: () => string;
    extected: string;
  };

  const tests: ReadonlyArray<Test> = [
    // getConfigPath
    {
      description: 'getConfigPath returns "$GHRED_CONFIG_FILE" if set',
      env: {
        GHRED_CONFIG_FILE: "/home/alan/.ghred/config.ts",
        GHRED_CONFIG_HOME: "/home/alan/.config/gh-red",
        XDG_CONFIG_HOME: "/home/alan/.config",
        HOME: "/home/alan",
      },
      fn: getConfigPath,
      extected: "/home/alan/.ghred/config.ts",
    },
    {
      description:
        'getConfigPath returns "$GHRED_CONFIG_HOME/config.ts" if set',
      env: {
        GHRED_CONFIG_HOME: "/home/alan/.ghred",
        XDG_CONFIG_HOME: "/home/alan/.config",
        HOME: "/home/alan",
      },
      fn: getConfigPath,
      extected: "/home/alan/.ghred/config.ts",
    },
    {
      description:
        'getConfigPath returns "$XDG_CONFIG_HOME/gh-red/config.ts" if set',
      env: {
        XDG_CONFIG_HOME: "/home/alan/Library/Application Support",
        HOME: "/home/alan",
      },
      fn: getConfigPath,
      extected: "/home/alan/Library/Application Support/gh-red/config.ts",
    },
    {
      description:
        'getConfigPath returns "$HOME/.config/gh-red/config.ts" if by default',
      env: {
        HOME: "/home/alan",
      },
      fn: getConfigPath,
      extected: "/home/alan/.config/gh-red/config.ts",
    },
    // getBinDir
    {
      description: 'getBinDir returns "$GHRED_DATA_HOME/bin" if set',
      env: {
        GHRED_DATA_HOME: "/home/alan/.ghred",
        XDG_DATA_HOME: "/home/alan/.local/share",
        HOME: "/home/alan",
      },
      fn: getBinDir,
      extected: "/home/alan/.ghred/bin",
    },
    {
      description: 'getBinDir returns "$XDG_DATA_HOME/gh-red/bin" if set',
      env: {
        XDG_DATA_HOME: "/home/alan/Library/Application Support",
        HOME: "/home/alan",
      },
      fn: getBinDir,
      extected: "/home/alan/Library/Application Support/gh-red/bin",
    },
    {
      description:
        'getBinDir returns "$HOME/.local/share/gh-red/bin" if by default',
      env: {
        HOME: "/home/alan",
      },
      fn: getBinDir,
      extected: "/home/alan/.local/share/gh-red/bin",
    },
    // getCompletionsDir
    {
      description:
        'getCompletionsDir returns "$GHRED_DATA_HOME/completions" if set',
      env: {
        GHRED_DATA_HOME: "/home/alan/.ghred",
        XDG_DATA_HOME: "/home/alan/.local/share",
        HOME: "/home/alan",
      },
      fn: getCompletionsDir,
      extected: "/home/alan/.ghred/completions",
    },
    {
      description:
        'getCompletionsDir returns "$XDG_DATA_HOME/gh-red/completions" if set',
      env: {
        XDG_DATA_HOME: "/home/alan/Library/Application Support",
        HOME: "/home/alan",
      },
      fn: getCompletionsDir,
      extected: "/home/alan/Library/Application Support/gh-red/completions",
    },
    {
      description:
        'getCompletionsDir returns "$HOME/.local/share/gh-red/completions" if by default',
      env: {
        HOME: "/home/alan",
      },
      fn: getCompletionsDir,
      extected: "/home/alan/.local/share/gh-red/completions",
    },
    // getPackagesDir
    {
      description: 'getPackagesDir returns "$GHRED_DATA_HOME/packages" if set',
      env: {
        GHRED_DATA_HOME: "/home/alan/.ghred",
        XDG_DATA_HOME: "/home/alan/.local/share",
        HOME: "/home/alan",
      },
      fn: getPackagesDir,
      extected: "/home/alan/.ghred/packages",
    },
    {
      description:
        'getPackagesDir returns "$XDG_DATA_HOME/gh-red/packages" if set',
      env: {
        XDG_DATA_HOME: "/home/alan/Library/Application Support",
        HOME: "/home/alan",
      },
      fn: getPackagesDir,
      extected: "/home/alan/Library/Application Support/gh-red/packages",
    },
    {
      description:
        'getPackagesDir returns "$HOME/.local/share/gh-red/packages" if by default',
      env: {
        HOME: "/home/alan",
      },
      fn: getPackagesDir,
      extected: "/home/alan/.local/share/gh-red/packages",
    },
    // getPackageDir
    {
      description:
        'getPackageDir returns "${getPackagesDir()}/github.com/${user}/${repo}"',
      env: {
        HOME: "/home/alan",
      },
      fn: () => getPackageDir("NagayamaRyoga", "jargon"),
      extected:
        `/home/alan/.local/share/gh-red/packages/github.com/NagayamaRyoga/jargon`,
    },
    // getStatePath
    {
      description: 'getStatePath returns "$GHRED_STATE_FILE" if set',
      env: {
        GHRED_STATE_FILE: "/home/alan/.ghred/state.yaml",
        GHRED_STATE_HOME: "/home/alan/.local/state/gh-red",
        XDG_STATE_HOME: "/home/alan/.local/state",
        HOME: "/home/alan",
      },
      fn: getStatePath,
      extected: "/home/alan/.ghred/state.yaml",
    },
    {
      description: 'getStatePath returns "$GHRED_STATE_HOME/state.yaml" if set',
      env: {
        GHRED_STATE_HOME: "/home/alan/.ghred",
        XDG_STATE_HOME: "/home/alan/.local/state",
        HOME: "/home/alan",
      },
      fn: getStatePath,
      extected: "/home/alan/.ghred/state.yaml",
    },
    {
      description:
        'getStatePath returns "$XDG_STATE_HOME/gh-red/state.yaml" if set',
      env: {
        XDG_STATE_HOME: "/home/alan/Library/Application Support",
        HOME: "/home/alan",
      },
      fn: getStatePath,
      extected: "/home/alan/Library/Application Support/gh-red/state.yaml",
    },
    {
      description:
        'getStatePath returns "$HOME/.local/state/gh-red/state.yaml" if by default',
      env: {
        HOME: "/home/alan",
      },
      fn: getStatePath,
      extected: "/home/alan/.local/state/gh-red/state.yaml",
    },
  ];

  for (const test of tests) {
    await t.step(test.description, () => {
      const envGetSpy = spyEnvGet(test.env);
      try {
        assertEquals(test.fn(), test.extected);
      } finally {
        envGetSpy.restore();
      }
    });
  }
});
