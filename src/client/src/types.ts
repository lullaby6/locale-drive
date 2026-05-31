export type SortBy = "filename" | "size" | "creationDate" | "modificationDate";

export type Order = "asc" | "desc";

export interface FileItem {
	filename: string;
	filePath: string;
	realFilePath: string;
	size: string;
	creationDate: string;
	modificationDate: string;
}
