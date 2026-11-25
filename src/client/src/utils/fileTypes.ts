import type { Entry } from "@/types";

export type FileKind =
	| "folder"
	| "image"
	| "video"
	| "audio"
	| "pdf"
	| "document"
	| "spreadsheet"
	| "presentation"
	| "archive"
	| "code"
	| "text"
	| "font"
	| "executable"
	| "android"
	| "disk"
	| "file";

/** What the preview modal can render for a kind. */
export type PreviewKind = "image" | "video" | "audio" | "pdf" | "text" | "none";

const KIND_BY_EXTENSION: Record<string, FileKind> = {};

function register(kind: FileKind, extensions: string[]) {
	for (const extension of extensions) KIND_BY_EXTENSION[extension] = kind;
}

register("image", ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "ico", "heic", "heif", "tif", "tiff"]);
register("video", ["mp4", "webm", "mov", "m4v", "mkv", "avi", "ogv", "wmv", "flv", "3gp", "mpg", "mpeg"]);
register("audio", ["mp3", "wav", "ogg", "oga", "m4a", "aac", "flac", "opus", "weba", "wma", "mid", "midi"]);
register("pdf", ["pdf"]);
register("document", ["doc", "docx", "odt", "rtf", "pages"]);
register("spreadsheet", ["xls", "xlsx", "ods", "csv", "tsv", "numbers"]);
register("presentation", ["ppt", "pptx", "odp", "key"]);
register("archive", ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz", "zst"]);
register("code", [
	"js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "html", "htm", "css", "scss", "sass", "less",
	"py", "rb", "php", "java", "kt", "c", "h", "cpp", "hpp", "cs", "go", "rs", "swift", "dart",
	"lua", "sh", "bash", "zsh", "ps1", "bat", "cmd", "sql", "xml", "yml", "yaml", "toml", "ini",
	"vue", "svelte", "astro", "dockerfile", "gradle", "env",
]);
register("text", ["txt", "md", "markdown", "log", "nfo", "srt", "vtt", "conf", "cfg"]);
register("font", ["ttf", "otf", "woff", "woff2", "eot"]);
register("executable", ["exe", "msi", "app", "deb", "rpm", "appimage", "jar"]);
register("android", ["apk", "aab", "xapk"]);
register("disk", ["iso", "img", "dmg", "vhd", "vhdx", "vmdk"]);

export function getExtension(filename: string) {
	const dot = filename.lastIndexOf(".");
	if (dot <= 0) return filename.toLowerCase() === "dockerfile" ? "dockerfile" : "";
	return filename.slice(dot + 1).toLowerCase();
}

export function getFileKind(entry: Pick<Entry, "name" | "type">): FileKind {
	if (entry.type === "folder") return "folder";
	return KIND_BY_EXTENSION[getExtension(entry.name)] ?? "file";
}

const KIND_ICONS: Record<FileKind, { icon: string; color: string }> = {
	folder: { icon: "tabler:folder-filled", color: "text-amber-400" },
	image: { icon: "tabler:photo", color: "text-rose-500" },
	video: { icon: "tabler:movie", color: "text-red-500" },
	audio: { icon: "tabler:music", color: "text-purple-500" },
	pdf: { icon: "tabler:file-type-pdf", color: "text-red-600" },
	document: { icon: "tabler:file-type-doc", color: "text-blue-500" },
	spreadsheet: { icon: "tabler:file-spreadsheet", color: "text-green-600" },
	presentation: { icon: "tabler:file-type-ppt", color: "text-orange-500" },
	archive: { icon: "tabler:file-zip", color: "text-yellow-600" },
	code: { icon: "tabler:file-code", color: "text-sky-500" },
	text: { icon: "tabler:file-text", color: "text-base-content/60" },
	font: { icon: "tabler:typography", color: "text-teal-500" },
	executable: { icon: "tabler:app-window", color: "text-slate-500" },
	android: { icon: "tabler:brand-android", color: "text-green-500" },
	disk: { icon: "tabler:disc", color: "text-slate-500" },
	file: { icon: "tabler:file", color: "text-base-content/50" },
};

export function getKindIcon(kind: FileKind) {
	return KIND_ICONS[kind];
}

// Formats browsers can play natively; others (mkv, avi...) fall back to an icon + download.
const PLAYABLE_VIDEO = ["mp4", "webm", "mov", "m4v", "ogv"];
const PLAYABLE_AUDIO = ["mp3", "wav", "ogg", "oga", "m4a", "aac", "flac", "opus", "weba"];
const RENDERABLE_IMAGE = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "ico"];

export function getPreviewKind(entry: Pick<Entry, "name" | "type">): PreviewKind {
	if (entry.type === "folder") return "none";

	const extension = getExtension(entry.name);
	const kind = getFileKind(entry);

	if (RENDERABLE_IMAGE.includes(extension)) return "image";
	if (PLAYABLE_VIDEO.includes(extension)) return "video";
	if (PLAYABLE_AUDIO.includes(extension)) return "audio";
	if (kind === "pdf") return "pdf";
	if (kind === "code" || kind === "text" || extension === "csv" || extension === "tsv") return "text";

	return "none";
}
