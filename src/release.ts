/**
 * Finds the desktop builds in the latest GitHub release of locale-drive, whatever their names
 * (they include the version): the installer is the asset ending in "setup.exe" and the portable
 * version the one ending in "portable.zip". Used at build time and again in the browser, so a new
 * release shows up without rebuilding the site.
 */

import { RELEASES_API } from "@/config";

export interface ReleaseAsset {
	name: string;
	url: string;
}

export interface LatestRelease {
	/** Tag without the leading "v", e.g. "2.0.0". */
	version: string;
	installer: ReleaseAsset | null;
	portable: ReleaseAsset | null;
}

interface GitHubRelease {
	tag_name: string;
	assets: { name: string; browser_download_url: string }[];
}

function pick(release: GitHubRelease, test: (name: string) => boolean): ReleaseAsset | null {
	const asset = release.assets.find(asset => test(asset.name.toLowerCase()));
	return asset ? { name: asset.name, url: asset.browser_download_url } : null;
}

export function parseRelease(release: GitHubRelease): LatestRelease {
	return {
		version: release.tag_name.replace(/^v/i, ""),
		installer: pick(release, name => name.endsWith("setup.exe")) ?? pick(release, name => name.endsWith(".exe") || name.endsWith(".msi")),
		portable: pick(release, name => name.endsWith("portable.zip")) ?? pick(release, name => name.endsWith(".zip")),
	};
}

/** null when GitHub can't be reached or there is no release yet. */
export async function fetchLatestRelease(): Promise<LatestRelease | null> {
	try {
		const response = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } });
		if (!response.ok) return null;
		return parseRelease((await response.json()) as GitHubRelease);
	} catch {
		return null;
	}
}
