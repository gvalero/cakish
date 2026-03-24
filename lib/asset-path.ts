const basePath = process.env.GITHUB_ACTIONS === "true" ? "/cakish" : "";

export function assetPath(path: string) {
  return `${basePath}${path}`;
}
