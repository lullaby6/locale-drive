/** Links and versions used across the site. Update them here when a new version ships. */

export const VERSION = "2.0.0";
export const NODE_VERSION = "22.12";

export const GITHUB_URL = "https://github.com/lullaby6/locale-drive";
export const NPM_URL = "https://www.npmjs.com/package/locale-drive";
export const DESKTOP_REPO_URL = "https://github.com/lullaby6/locale-drive-tauri";
/** The desktop builds are published in the releases of the main repository. */
export const RELEASES_URL = `${GITHUB_URL}/releases/latest`;
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

/**
 * Direct links to the Windows builds of the desktop app (built in locale-drive-tauri, released in locale-drive).
 * GitHub turns the spaces of "Locale Drive_x.x.x_x64-setup.exe" into dots in asset names.
 */
export const INSTALLER_FILE = `Locale.Drive_${VERSION}_x64-setup.exe`;
export const PORTABLE_FILE = `Locale.Drive_${VERSION}_x64-portable.zip`;
export const INSTALLER_URL = `${RELEASES_URL}/download/${INSTALLER_FILE}`;
export const PORTABLE_URL = `${RELEASES_URL}/download/${PORTABLE_FILE}`;

export const DEFAULT_PORT = 24680;

/** Prefixes a site path with the base path ("/" locally, "/locale-drive/" on GitHub Pages). */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
