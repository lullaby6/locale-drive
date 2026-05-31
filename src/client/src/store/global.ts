import { create } from "zustand";

import { toast } from "react-toastify";

import * as filesService from "@/services/files";
import { getAxiosRequestErrorMessage } from "@/utils/utils";

import type { FileItem, Order, SortBy } from "@/types";

interface GlobalState {
	files: FileItem[];
	storagePath: string;
	loading: boolean;
	query: string;
	sortBy: SortBy;
	orderBy: Order;

	fetchFiles: () => Promise<void>;
	silentRefresh: () => Promise<void>;
	setQuery: (query: string) => void;
	setSort: (column: SortBy) => void;
	removeFile: (filename: string) => Promise<void>;
	renameFile: (filename: string, newFilename: string) => Promise<void>;
	downloadFile: (filename: string) => Promise<void>;
	uploadFiles: (files: FileList | File[]) => Promise<void>;
	openStorage: () => Promise<void>;
}

const useGlobalStore = create<GlobalState>((set, get) => {
	async function refresh() {
		const { query, sortBy, orderBy } = get();

		const { files, storagePath } = await filesService.getFiles({
			query,
			sort: sortBy,
			order: orderBy,
		});

		set({ files, storagePath });
	}

	async function withLoading(fn: () => Promise<void>) {
		set({ loading: true });

		try {
			await fn();
		} catch (error) {
			toast.error(getAxiosRequestErrorMessage(error));
		} finally {
			set({ loading: false });
		}
	}

	return {
		files: [],
		storagePath: "",
		loading: false,
		query: "",
		sortBy: "modificationDate",
		orderBy: "desc",

		fetchFiles: () => withLoading(refresh),

		silentRefresh: async () => {
			if (get().loading) return;

			try {
				await refresh();
			} catch {
				// background poll: ignore errors so it keeps retrying quietly
			}
		},

		setQuery: query => {
			set({ query });
			withLoading(refresh);
		},

		setSort: column => {
			const { sortBy, orderBy } = get();

			if (sortBy === column) {
				set({ orderBy: orderBy === "asc" ? "desc" : "asc" });
			} else {
				set({ sortBy: column, orderBy: "desc" });
			}

			withLoading(refresh);
		},

		removeFile: filename =>
			withLoading(async () => {
				await filesService.deleteFile(filename);
				toast.success("File deleted successfully");
				await refresh();
			}),

		renameFile: (filename, newFilename) =>
			withLoading(async () => {
				await filesService.renameFile(filename, newFilename);
				toast.success("File renamed successfully");
				await refresh();
			}),

		downloadFile: filename =>
			withLoading(async () => {
				await filesService.downloadFile(filename);
			}),

		uploadFiles: files =>
			withLoading(async () => {
				await filesService.uploadFiles(files);
				toast.success("File uploaded successfully");
				await refresh();
			}),

		openStorage: () =>
			withLoading(async () => {
				await filesService.openStoragePath();
			}),
	};
});

export default useGlobalStore;
