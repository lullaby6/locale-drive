import { useRef } from "react";
import type { ChangeEvent, JSX } from "react";

import { Icon } from "@iconify/react";

import { API_URL } from "@/services/files";
import useGlobalStore from "@/store/global";
import { isImage } from "@/utils/utils";

import type { FileItem, SortBy } from "@/types";

const RENAME_DEBOUNCE = 1000;

const COLUMNS: { key: SortBy; label: string }[] = [
	{ key: "filename", label: "Filename" },
	{ key: "size", label: "Size" },
	{ key: "modificationDate", label: "Last Modified" },
	{ key: "creationDate", label: "Creation Date" },
];

function SortIcon({ active, order }: { active: boolean; order: "asc" | "desc" }) {
	if (!active) {
		return (
			<Icon
				icon="tabler:arrows-sort"
				width="1em"
				height="1em"
				className="text-base opacity-50"
			/>
		);
	}

	return (
		<Icon
			icon={order === "asc" ? "tabler:sort-ascending" : "tabler:sort-descending"}
			width="1em"
			height="1em"
			className="text-base"
		/>
	);
}

function Row({ file }: { file: FileItem }): JSX.Element {
	const loading = useGlobalStore(state => state.loading);
	const downloadFile = useGlobalStore(state => state.downloadFile);
	const removeFile = useGlobalStore(state => state.removeFile);
	const renameFile = useGlobalStore(state => state.renameFile);

	const renameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fileUrl = `${API_URL}/storage/${encodeURIComponent(file.filename)}`;

	function handleRename(event: ChangeEvent<HTMLInputElement>) {
		const newFilename = event.target.value;

		if (newFilename === file.filename || newFilename.trim() === "") return;

		if (renameTimeout.current) clearTimeout(renameTimeout.current);

		renameTimeout.current = setTimeout(() => {
			renameFile(file.filename, newFilename);
		}, RENAME_DEBOUNCE);
	}

	return (
		<tr>
			<td>
				<div className="flex justify-center items-center">
					{isImage(file.filename) ? (
						<a href={fileUrl} target="_blank" rel="noreferrer">
							<img
								src={fileUrl}
								alt={file.filename}
								loading="lazy"
								className="size-12 object-cover"
							/>
						</a>
					) : (
						<div className="flex justify-center items-center size-12 bg-base-200 text-base-content/50">
							<Icon icon="tabler:file" width="1.5em" height="1.5em" />
						</div>
					)}
				</div>
			</td>
			<td>
				<div className="flex justify-center items-center gap-2">
					<button
						onClick={() => downloadFile(file.filename)}
						disabled={loading}
						className="btn btn-circle btn-sm btn-primary action-btn"
						aria-label="Download"
					>
						<Icon icon="tabler:download" width="1em" height="1em" />
					</button>

					<a
						href={fileUrl}
						target="_blank"
						rel="noreferrer"
						className="btn btn-circle btn-sm btn-info action-btn"
						aria-label="Open in new tab"
					>
						<Icon icon="tabler:external-link" width="1em" height="1em" />
					</a>

					<button
						onClick={() => removeFile(file.filename)}
						disabled={loading}
						className="btn btn-circle btn-sm btn-error action-btn"
						aria-label="Delete"
					>
						<Icon icon="tabler:trash" width="1em" height="1em" />
					</button>
				</div>
			</td>
			<td>
				<input
					onChange={handleRename}
					className="input input-ghost w-full text-sm"
					type="text"
					defaultValue={file.filename}
					placeholder="Filename"
					spellCheck={false}
					autoComplete="off"
				/>
			</td>
			<td className="text-nowrap text-sm">{file.size}</td>
			<td className="text-nowrap text-sm">{file.modificationDate}</td>
			<td className="text-nowrap text-sm">{file.creationDate}</td>
		</tr>
	);
}

export default (): JSX.Element => {
	const files = useGlobalStore(state => state.files);
	const sortBy = useGlobalStore(state => state.sortBy);
	const orderBy = useGlobalStore(state => state.orderBy);
	const setSort = useGlobalStore(state => state.setSort);

	return (
		<div className="rounded shadow-sm border border-base-200 bg-base-300 p-4 overflow-x-auto">
			<table className="table table-xs">
				<thead>
					<tr>
						<th className="text-center">Preview</th>
						<th className="text-center">Actions</th>

						{COLUMNS.map(column => (
							<th key={column.key}>
								<button
									onClick={() => setSort(column.key)}
									className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
								>
									<span>{column.label}</span>
									<SortIcon
										active={sortBy === column.key}
										order={orderBy}
									/>
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{files.map(file => (
						<Row key={file.filename} file={file} />
					))}
				</tbody>
			</table>

			{files.length === 0 && (
				<p className="text-center text-base-content/50 py-6">
					No files found.
				</p>
			)}
		</div>
	);
};
