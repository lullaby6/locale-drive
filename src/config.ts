/** Links and versions used across the site. Update them here when a new version ships. */

export const NODE_VERSION = "22.12";

export const GITHUB_URL = "https://github.com/lullaby6/locale-drive";
export const NPM_URL = "https://www.npmjs.com/package/locale-drive";
export const DESKTOP_REPO_URL = "https://github.com/lullaby6/locale-drive-tauri";
/**
 * The desktop builds (made in locale-drive-tauri) are published in the releases of the main repository.
 * The download buttons find them in the latest release (see release.ts); this page is the fallback.
 */
export const RELEASES_URL = `${GITHUB_URL}/releases/latest`;
export const RELEASES_API = "https://api.github.com/repos/lullaby6/locale-drive/releases/latest";
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

export const DEFAULT_PORT = 24680;

/** Prefixes a site path with the base path ("/" locally, "/locale-drive/" on GitHub Pages). */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
