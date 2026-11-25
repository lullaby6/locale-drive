import axios from "axios";

import type { Entry, Order, ServerInfo, SharedClipboard, SortBy, StorageStats } from "@/types";

// Relative on purpose: the page is served by the same Express server it talks to,
// and in dev Vite proxies these paths (see vite.config.ts).
const API = "/api";

export const EVENTS_URL = `${API}/events`;

function encodePath(path: string) {
	return path.split("/").map(encodeURIComponent).join("/");
}

/** Direct URL of a stored file, used for previews and "open in new tab". */
export function getFileUrl(path: string) {
	return `/storage/${encodePath(path)}`;
}

export function getDownloadUrl(path: string) {
	return `${API}/download?path=${encodeURIComponent(path)}`;
}

interface GetEntriesParams {
	dir?: string;
	query?: string;
	sort?: SortBy;
	order?: Order;
}

export interface GetEntriesResult {
	entries: Entry[];
	dir: string;
	realPath: string;
	rootPath: string;
	truncated: boolean;
}

export async function getEntries({
	dir = "",
	query = "",
	sort = "modificationDate",
	order = "desc",
}: GetEntriesParams = {}): Promise<GetEntriesResult> {
	const params = new URLSearchParams({ sort, order });

	if (dir) params.set("dir", dir);
	if (query.trim() !== "") params.set("q", query.trim());

	const response = await axios.get<GetEntriesResult>(`${API}/entries?${params}`);
	return response.data;
}

export async function createFolder(dir: string, name: string) {
	const response = await axios.post(`${API}/folder`, { dir, name });
	return response.data as { message: string; path: string };
}

export async function moveEntries(paths: string[], destination: string) {
	const response = await axios.post(`${API}/move`, { paths, destination });
	return response.data as { message: string; count: number };
}

export async function duplicateEntry(path: string) {
	const response = await axios.post(`${API}/duplicate`, { path });
	return response.data as { message: string; path: string };
}

export async function deleteEntries(paths: string[]) {
	const response = await axios.post(`${API}/delete`, { paths });
	return response.data as { message: string };
}

export async function renameEntry(path: string, name: string) {
	const response = await axios.put(`${API}/rename`, { path, name });
	return response.data as { message: string; path: string };
}

export async function uploadFiles(
	dir: string,
	files: File[],
	onProgress: (loaded: number, total: number) => void,
	signal: AbortSignal,
) {
	const formData = new FormData();
	for (const file of files) formData.append("file", file, file.name);

	const params = dir ? `?dir=${encodeURIComponent(dir)}` : "";

	const response = await axios.post(`${API}/upload${params}`, formData, {
		signal,
		onUploadProgress: event => onProgress(event.loaded, event.total ?? 0),
	});

	return response.data as { message: string };
}

/** Lets the browser download the file natively (shows progress, supports resuming). */
export function downloadFile(path: string) {
	const a = document.createElement("a");
	a.href = getDownloadUrl(path);
	a.download = "";
	document.body.appendChild(a);
	a.click();
	a.remove();
}

function getDownloadFrame() {
	const name = "download-frame";
	let frame = document.querySelector<HTMLIFrameElement>(`iframe[name="${name}"]`);

	if (!frame) {
		frame = document.createElement("iframe");
		frame.name = name;
		frame.style.display = "none";
		document.body.appendChild(frame);
	}

	return frame;
}

/** Downloads several files/folders as one .zip. Uses a form POST so long selections fit. */
export function downloadZip(paths: string[]) {
	const form = document.createElement("form");
	form.method = "POST";
	form.action = `${API}/zip`;
	form.style.display = "none";
	// Target a hidden iframe so an error response never replaces the app page.
	form.target = getDownloadFrame().name;

	for (const path of paths) {
		const input = document.createElement("input");
		input.type = "hidden";
		input.name = "path";
		input.value = path;
		form.appendChild(input);
	}

	document.body.appendChild(form);
	form.submit();
	form.remove();
}

export async function openFolder(dir: string) {
	await axios.get(`${API}/open`, { params: dir ? { dir } : {} });
}

export async function getStats() {
	return (await axios.get<StorageStats>(`${API}/stats`)).data;
}

export async function getInfo() {
	return (await axios.get<ServerInfo>(`${API}/info`)).data;
}

export async function getClipboard() {
	return (await axios.get<SharedClipboard>(`${API}/clipboard`)).data;
}

export async function setClipboard(text: string) {
	return (await axios.put<SharedClipboard>(`${API}/clipboard`, { text })).data;
}
