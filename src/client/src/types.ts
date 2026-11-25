export type SortBy = "filename" | "size" | "creationDate" | "modificationDate";

export type Order = "asc" | "desc";

export type ViewMode = "list" | "grid";

export type EntryType = "file" | "folder";

export interface Entry {
	name: string;
	/** Path relative to the storage root, with "/" separators. */
	path: string;
	/** Relative path of the folder that contains the entry ("" for the root). */
	parent: string;
	type: EntryType;
	size: number;
	/** Number of direct children, only for folders. */
	items: number | null;
	creationDate: string;
	modificationDate: string;
}

export interface StorageStats {
	files: number;
	folders: number;
	bytes: number;
	disk: { total: number; free: number } | null;
}

export interface ServerInfo {
	url: string;
	maxUploadBytes: number;
}

export interface SharedClipboard {
	text: string;
	updatedAt: string | null;
}

export type UploadStatus = "uploading" | "done" | "error" | "canceled";

export interface UploadTask {
	id: number;
	names: string[];
	loaded: number;
	total: number;
	status: UploadStatus;
	error?: string;
	startedAt: number;
	controller: AbortController;
}

export type Dialog =
	| { kind: "newFolder" }
	| { kind: "rename"; entry: Entry }
	| { kind: "delete"; paths: string[] }
	| { kind: "duplicate"; entry: Entry }
	| { kind: "qr" }
	| { kind: "shortcuts" }
	| { kind: "clipboard" };
