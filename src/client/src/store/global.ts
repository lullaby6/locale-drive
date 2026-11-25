import { create } from "zustand";

import { toast } from "react-toastify";

import * as api from "@/services/files";
import { getT } from "@/i18n";
import { baseName, formatBytes, getAxiosRequestErrorMessage, isNetworkError, splitPath } from "@/utils/utils";

import type {
	Dialog,
	Entry,
	Order,
	ServerInfo,
	SharedClipboard,
	SortBy,
	StorageStats,
	UploadTask,
	ViewMode,
} from "@/types";

const VIEW_STORAGE_KEY = "view";
const UPLOAD_DISMISS_DELAY = 4000;

/** The current folder lives in the URL hash (#/photos/2024) so the browser back button works. */
export function getDirFromHash() {
	const raw = window.location.hash.replace(/^#\/?/, "");

	try {
		return splitPath(raw).map(decodeURIComponent).join("/");
	} catch {
		return "";
	}
}

function setHashDir(dir: string) {
	const hash = `#/${splitPath(dir).map(encodeURIComponent).join("/")}`;
	if (window.location.hash !== hash) window.location.hash = hash;
}

function getInitialView(): ViewMode {
	const saved = localStorage.getItem(VIEW_STORAGE_KEY);
	if (saved === "list" || saved === "grid") return saved;
	// Phones and small tablets get the grid by default, desktops the list.
	return window.matchMedia("(max-width: 767px)").matches ? "grid" : "list";
}

interface GlobalState {
	dir: string;
	entries: Entry[];
	rootPath: string;
	realPath: string;
	truncated: boolean;

	/** Full-screen overlay for actions that change files. */
	loading: boolean;
	/** Lighter indicator while the listing loads. */
	fetching: boolean;

	/** Whether the Express server can be reached. */
	connection: "connecting" | "online" | "offline";
	/** False until the first successful contact (decides between the full offline page and the banner). */
	everConnected: boolean;
	/** Folder from the URL that doesn't exist (shows the "folder not found" view). */
	missingDir: string | null;

	query: string;
	sortBy: SortBy;
	orderBy: Order;
	view: ViewMode;

	selected: string[];
	/** Item the keyboard is on (arrows move it, Enter opens it). */
	cursor: string | null;
	/** Where a Shift+arrow / Shift+click range starts. */
	anchor: string | null;
	/** The cursor ring only shows while the keyboard is being used. */
	cursorVisible: boolean;
	uploads: UploadTask[];
	stats: StorageStats | null;
	info: ServerInfo | null;
	clipboard: SharedClipboard;

	preview: Entry | null;
	dialog: Dialog | null;
	/** Paths being dragged inside the app (to dim them and validate drop targets). */
	dragging: string[];

	init: () => Promise<void>;
	markOnline: () => void;
	markOffline: () => void;
	refresh: (options?: { silent?: boolean }) => Promise<void>;
	syncDirFromHash: () => void;
	navigate: (dir: string) => void;

	setQuery: (query: string) => void;
	setSort: (column: SortBy, order?: Order) => void;
	setView: (view: ViewMode) => void;

	toggleSelected: (path: string) => void;
	/** Shift+click: select everything between the anchor and `path`. */
	selectRange: (path: string) => void;
	/** Click on an item: Shift selects a range, anything else toggles it. */
	clickSelect: (path: string, event: { shiftKey: boolean }) => void;
	setSelected: (paths: string[]) => void;
	clearSelection: () => void;
	setCursor: (path: string | null, options?: { visible?: boolean; keepAnchor?: boolean }) => void;
	hideCursor: () => void;

	openEntry: (entry: Entry) => void;
	setPreview: (entry: Entry | null) => void;
	openDialog: (dialog: Dialog) => void;
	setDragging: (paths: string[]) => void;
	closeDialog: () => void;

	createFolder: (name: string) => Promise<boolean>;
	renameEntry: (entry: Entry, name: string) => Promise<boolean>;
	deleteEntries: (paths: string[]) => Promise<boolean>;
	moveEntries: (paths: string[], destination: string) => Promise<boolean>;
	duplicateEntry: (entry: Entry) => Promise<boolean>;
	download: (entries: Entry[]) => void;
	/** Uploads into `dir`, or the current folder when omitted. */
	uploadFiles: (files: File[], dir?: string) => void;
	cancelUpload: (id: number) => void;
	dismissUpload: (id: number) => void;
	openFolder: () => Promise<void>;

	fetchStats: () => Promise<void>;
	saveClipboard: (text: string) => Promise<boolean>;
	receiveClipboard: (clipboard: SharedClipboard) => void;
}

let requestId = 0;
let uploadId = 0;

const useGlobalStore = create<GlobalState>((set, get) => {
	async function withLoading(fn: () => Promise<void>) {
		set({ loading: true });

		try {
			await fn();
			return true;
		} catch (error) {
			if (isNetworkError(error)) get().markOffline();
			toast.error(getAxiosRequestErrorMessage(error), { toastId: isNetworkError(error) ? "network-error" : undefined });
			return false;
		} finally {
			set({ loading: false });
		}
	}

	function updateUpload(id: number, patch: Partial<UploadTask>) {
		set(state => ({
			uploads: state.uploads.map(upload => (upload.id === id ? { ...upload, ...patch } : upload)),
		}));
	}

	return {
		dir: getDirFromHash(),
		entries: [],
		rootPath: "",
		realPath: "",
		truncated: false,

		loading: false,
		fetching: false,

		connection: "connecting",
		everConnected: false,
		missingDir: null,

		query: "",
		sortBy: "modificationDate",
		orderBy: "desc",
		view: getInitialView(),

		selected: [],
		cursor: null,
		anchor: null,
		cursorVisible: false,
		uploads: [],
		stats: null,
		info: null,
		clipboard: { text: "", updatedAt: null },

		preview: null,
		dialog: null,
		dragging: [],

		init: async () => {
			const [info, clipboard] = await Promise.allSettled([api.getInfo(), api.getClipboard()]);

			if (info.status === "fulfilled") set({ info: info.value });
			if (clipboard.status === "fulfilled") set({ clipboard: clipboard.value });

			if (info.status === "rejected" && isNetworkError(info.reason)) {
				get().markOffline();
				return;
			}

			await Promise.all([get().refresh(), get().fetchStats()]);
		},

		markOnline: () => {
			const { connection, everConnected } = get();
			if (connection === "online") return;

			set({ connection: "online", everConnected: true });

			if (connection !== "offline") return;

			// Back from an outage: catch up on whatever changed meanwhile.
			if (everConnected) {
				toast.success(getT().connection.reconnected, { toastId: "reconnected" });
				get().refresh({ silent: true });
				get().fetchStats();
			} else {
				get().init();
			}
		},

		markOffline: () => {
			if (get().connection !== "offline") set({ connection: "offline" });
		},

		refresh: async ({ silent = false } = {}) => {
			const id = ++requestId;
			const { dir, query, sortBy, orderBy } = get();

			if (!silent) set({ fetching: true });

			try {
				const result = await api.getEntries({ dir, query, sort: sortBy, order: orderBy });

				// A newer request (e.g. the user navigated again) already won.
				if (id !== requestId) return;

				const existing = new Set(result.entries.map(entry => entry.path));

				get().markOnline();

				set(state => ({
					entries: result.entries,
					rootPath: result.rootPath,
					realPath: result.realPath,
					truncated: result.truncated,
					missingDir: null,
					selected: state.selected.filter(path => existing.has(path)),
					cursor: state.cursor && existing.has(state.cursor) ? state.cursor : null,
					anchor: state.anchor && existing.has(state.anchor) ? state.anchor : null,
					preview: state.preview && !existing.has(state.preview.path) ? null : state.preview,
				}));
			} catch (error: any) {
				if (id !== requestId) return;

				if (isNetworkError(error)) {
					get().markOffline();
					// Background refreshes stay quiet; the banner already says the connection is down.
					if (!silent && get().everConnected) {
						toast.error(getAxiosRequestErrorMessage(error), { toastId: "network-error" });
					}
					return;
				}

				get().markOnline();

				if (error?.response?.status === 404 && get().dir !== "") {
					set({ missingDir: get().dir, entries: [], selected: [], cursor: null, anchor: null });
					return;
				}

				if (!silent) toast.error(getAxiosRequestErrorMessage(error));
			} finally {
				if (id === requestId) set({ fetching: false });
			}
		},

		syncDirFromHash: () => {
			const dir = getDirFromHash();
			if (dir === get().dir) return;

			set({ dir, query: "", selected: [], preview: null, cursor: null, anchor: null, missingDir: null });
			get().refresh();
		},

		navigate: dir => {
			setHashDir(dir);
			get().syncDirFromHash();
		},

		setQuery: query => {
			set({ query, selected: [] });
			get().refresh();
		},

		setSort: (column, order) => {
			const { sortBy, orderBy } = get();

			if (order) set({ sortBy: column, orderBy: order });
			else if (sortBy === column) set({ orderBy: orderBy === "asc" ? "desc" : "asc" });
			else set({ sortBy: column, orderBy: column === "filename" ? "asc" : "desc" });

			get().refresh();
		},

		setView: view => {
			localStorage.setItem(VIEW_STORAGE_KEY, view);
			set({ view });
		},

		toggleSelected: path =>
			set(state => ({
				selected: state.selected.includes(path)
					? state.selected.filter(item => item !== path)
					: [...state.selected, path],
				cursor: path,
				anchor: path,
			})),

		selectRange: path => {
			const { entries, anchor, selected } = get();
			const from = entries.findIndex(entry => entry.path === (anchor ?? path));
			const to = entries.findIndex(entry => entry.path === path);
			if (from === -1 || to === -1) return get().toggleSelected(path);

			const [start, end] = from <= to ? [from, to] : [to, from];
			const range = entries.slice(start, end + 1).map(entry => entry.path);

			set({ selected: Array.from(new Set([...selected, ...range])), cursor: path });
		},

		clickSelect: (path, event) => {
			if (event.shiftKey) get().selectRange(path);
			else get().toggleSelected(path);
		},

		setSelected: paths => set({ selected: paths }),

		clearSelection: () => set({ selected: [] }),

		setCursor: (path, { visible = true, keepAnchor = false } = {}) =>
			set(state => ({ cursor: path, anchor: keepAnchor ? state.anchor ?? path : path, cursorVisible: visible })),

		hideCursor: () => {
			if (get().cursorVisible) set({ cursorVisible: false });
		},

		openEntry: entry => {
			if (entry.type === "folder") get().navigate(entry.path);
			else set({ preview: entry });
		},

		setPreview: entry => set({ preview: entry }),

		openDialog: dialog => set({ dialog }),

		setDragging: paths => set({ dragging: paths }),

		closeDialog: () => set({ dialog: null }),

		createFolder: name =>
			withLoading(async () => {
				const result = await api.createFolder(get().dir, name);
				toast.success(getT().toasts.folderCreated(baseName(result.path)));
				await get().refresh({ silent: true });
			}),

		renameEntry: (entry, name) =>
			withLoading(async () => {
				await api.renameEntry(entry.path, name);
				toast.success(getT().toasts.renamed);
				await get().refresh({ silent: true });
			}),

		deleteEntries: paths =>
			withLoading(async () => {
				await api.deleteEntries(paths);
				toast.success(getT().toasts.deleted(paths.length));
				set(state => ({ selected: state.selected.filter(path => !paths.includes(path)) }));
				await get().refresh({ silent: true });
			}),

		moveEntries: (paths, destination) =>
			withLoading(async () => {
				const result = await api.moveEntries(paths, destination);
				if (result.count > 0) {
					toast.success(getT().toasts.moved(result.count, baseName(destination) || getT().common.storage));
				}
				set(state => ({ selected: state.selected.filter(path => !paths.includes(path)) }));
				await get().refresh({ silent: true });
			}),

		duplicateEntry: entry =>
			withLoading(async () => {
				const result = await api.duplicateEntry(entry.path);
				toast.success(getT().toasts.duplicated(baseName(result.path)));
				await get().refresh({ silent: true });
			}),

		download: entries => {
			if (entries.length === 0) return;

			if (entries.length === 1 && entries[0].type === "file") {
				api.downloadFile(entries[0].path);
				return;
			}

			api.downloadZip(entries.map(entry => entry.path));
			toast.info(getT().toasts.preparingZip);
		},

		uploadFiles: (files, dir = get().dir) => {
			const maxBytes = get().info?.maxUploadBytes ?? 0;

			let accepted = files;

			if (maxBytes > 0) {
				const tooLarge = files.filter(file => file.size > maxBytes);
				accepted = files.filter(file => file.size <= maxBytes);

				if (tooLarge.length > 0) {
					toast.error(getT().toasts.tooLargeSkipped(tooLarge.length, formatBytes(maxBytes)));
				}
			}

			if (accepted.length === 0) return;

			const id = ++uploadId;
			const controller = new AbortController();
			const total = accepted.reduce((sum, file) => sum + file.size, 0);

			set(state => ({
				uploads: [
					...state.uploads,
					{
						id,
						names: accepted.map(file => file.name),
						loaded: 0,
						total,
						status: "uploading",
						startedAt: Date.now(),
						controller,
					},
				],
			}));

			api.uploadFiles(
				dir,
				accepted,
				(loaded, eventTotal) => updateUpload(id, { loaded, total: eventTotal || total }),
				controller.signal,
			)
				.then(() => {
					updateUpload(id, { status: "done" });
					toast.success(getT().toasts.uploaded(accepted.length));
					get().refresh({ silent: true });
					setTimeout(() => get().dismissUpload(id), UPLOAD_DISMISS_DELAY);
				})
				.catch(error => {
					if (controller.signal.aborted) {
						updateUpload(id, { status: "canceled" });
						setTimeout(() => get().dismissUpload(id), UPLOAD_DISMISS_DELAY);
						return;
					}

					const message = getAxiosRequestErrorMessage(error);
					updateUpload(id, { status: "error", error: message });
					toast.error(message);
				});
		},

		cancelUpload: id => {
			get().uploads.find(upload => upload.id === id)?.controller.abort();
		},

		dismissUpload: id => set(state => ({ uploads: state.uploads.filter(upload => upload.id !== id) })),

		openFolder: async () => {
			await withLoading(async () => {
				await api.openFolder(get().dir);
			});
		},

		fetchStats: async () => {
			try {
				set({ stats: await api.getStats() });
			} catch {
				// stats are informative only
			}
		},

		saveClipboard: text =>
			withLoading(async () => {
				set({ clipboard: await api.setClipboard(text) });
				toast.success(getT().toasts.clipboardUpdated);
			}),

		receiveClipboard: clipboard => set({ clipboard }),
	};
});

export default useGlobalStore;
