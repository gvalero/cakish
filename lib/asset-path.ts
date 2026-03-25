// NEXT_PUBLIC_ variables are inlined at build time AND available at runtime in the browser.
// This ensures assetPath() works correctly both on first load and after client-side navigation.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string) {
  return `${basePath}${path}`;
}
