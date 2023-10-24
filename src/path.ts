const ghredConfigFile = () => Deno.env.get("GHRED_CONFIG_FILE");
const ghredConfigHome = () => Deno.env.get("GHRED_CONFIG_HOME");
const ghredDataHome = () => Deno.env.get("GHRED_DATA_HOME");
const ghredStateFile = () => Deno.env.get("GHRED_STATE_FILE");
const ghredStateHome = () => Deno.env.get("GHRED_STATE_HOME");

const home = () => Deno.env.get("HOME") ?? "";
const xdgConfigHome = () => Deno.env.get("XDG_CONFIG_HOME");
const xdgDataHome = () => Deno.env.get("XDG_DATA_HOME");
const xdgStateHome = () => Deno.env.get("XDG_STATE_HOME");

function getConfigDir(): string {
  return ghredConfigHome() ??
    `${xdgConfigHome() ?? `${home()}/.config`}/gh-red`;
}

export function getConfigPath(): string {
  return ghredConfigFile() ?? `${getConfigDir()}/config.ts`;
}

function getDataHomePath(): string {
  return ghredDataHome() ??
    `${xdgDataHome() ?? `${home()}/.local/share`}/gh-red`;
}

export function getBinDir(): string {
  return `${getDataHomePath()}/bin`;
}

export function getCompletionsDir(): string {
  return `${getDataHomePath()}/completions`;
}

export function getManualsDir(): string {
  return `${getDataHomePath()}/man`;
}

export function getPackagesDir(): string {
  return `${getDataHomePath()}/packages`;
}

export function getPackageDir(user: string, repo: string): string {
  return `${getPackagesDir()}/github.com/${encodeURIComponent(user)}/${
    encodeURIComponent(repo)
  }`;
}

function getStateDir(): string {
  return ghredStateHome() ??
    `${xdgStateHome() ?? `${home()}/.local/state`}/gh-red`;
}

export function getStatePath(): string {
  return ghredStateFile() ?? `${getStateDir()}/state.yaml`;
}
