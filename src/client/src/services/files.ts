import axios from "axios";

import { formatBytes, formatDate } from "@/utils/utils";

import type { FileItem, Order, SortBy } from "@/types";

export const API_URL = import.meta.env.VITE_API_URL;

interface GetFilesParams {
	query?: string;
	sort?: SortBy;
	order?: Order;
}

interface GetFilesResult {
	files: FileItem[];
	storagePath: string;
}

export async function getFiles({
	query = "",
	sort = "modificationDate",
	order = "desc",
}: GetFilesParams = {}): Promise<GetFilesResult> {
	const params = new URLSearchParams();

	if (query && query.trim() !== "") params.append("q", query.trim());

	params.append("sort", sort);
	params.append("order", order);

	const response = await axios.get(`${API_URL}/files?${params.toString()}`);

	const files: FileItem[] = response.data.files.map((file: any) => ({
		...file,
		modificationDate: formatDate(file.modificationDate),
		creationDate: formatDate(file.creationDate),
		size: formatBytes(file.size),
	}));

	return { files, storagePath: response.data.realPath };
}

export async function deleteFile(filename: string) {
	await axios.delete(`${API_URL}/file/${encodeURIComponent(filename)}`);
}

export async function downloadFile(filename: string) {
	const response = await axios.get(
		`${API_URL}/download/${encodeURIComponent(filename)}`,
		{ responseType: "arraybuffer" }
	);

	const blob = new Blob([response.data]);
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();

	URL.revokeObjectURL(url);
}

export async function renameFile(filename: string, newFilename: string) {
	await axios.put(`${API_URL}/rename/${encodeURIComponent(filename)}`, {
		new_filename: newFilename,
	});
}

export async function uploadFiles(files: FileList | File[]) {
	const formData = new FormData();

	for (const file of files) {
		formData.append("file", file);
	}

	await axios.post(`${API_URL}/upload`, formData);
}

export async function openStoragePath() {
	await axios.get(`${API_URL}/open`);
}
