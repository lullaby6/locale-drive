// Kept free of imports so the language files can use it without circular dependencies.

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatBytes(bytes: number) {
	if (!bytes || bytes < 0) return "0 B";
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
	return `${+(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${BYTE_UNITS[i]}`;
}
