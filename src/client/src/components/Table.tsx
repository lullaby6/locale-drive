import type { JSX, MouseEvent } from "react";

import { Icon } from "@iconify/react";

import Checkbox from "@/components/Checkbox";
import Thumbnail from "@/components/Thumbnail";
import { useDraggableEntry, useFolderDropTarget } from "@/hooks/useEntryDrag";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { formatBytes, formatDate } from "@/utils/utils";

import type { Translations } from "@/languages/en";
import type { Entry, Order, SortBy } from "@/types";

const COLUMNS: { key: SortBy; label: keyof Translations["columns"]; className?: string }[] = [
	{ key: "filename", label: "name" },
	{ key: "size", label: "size" },
	{ key: "modificationDate", label: "modified", className: "hidden md:table-cell" },
	{ key: "creationDate", label: "created", className: "hidden xl:table-cell" },
];

function SortIcon({ active, order }: { active: boolean; order: Order }) {
	if (!active) {
		return <Icon icon="tabler:selector" width="1em" height="1em" className="text-sm opacity-50" />;
	}

	return (
		<Icon
			icon={order === "asc" ? "tabler:chevron-up" : "tabler:chevron-down"}
			width="1em"
			height="1em"
			className="text-sm text-primary"
		/>
	);
}

/** Stops the click from also toggling the row selection. */
function stop(event: MouseEvent) {
	event.stopPropagation();
}

function ActionButton({ icon, label, onClick, danger = false }: { icon: string; label: string; onClick: () => void; danger?: boolean }) {
	return (
		<button
			onClick={onClick}
			className={`btn btn-ghost btn-circle btn-sm opacity-60 hover:opacity-100 ${danger ? "hover:text-error" : ""}`}
			aria-label={label}
			data-tooltip-id="tooltip"
			data-tooltip-content={label}
		>
			<Icon icon={icon} width="1em" height="1em" className="text-lg" />
		</button>
	);
}

function Row({ entry, searching }: { entry: Entry; searching: boolean }): JSX.Element {
	const t = useT();
	const selected = useGlobalStore(state => state.selected.includes(entry.path));
	const isDragged = useGlobalStore(state => state.dragging.includes(entry.path));
	const toggleSelected = useGlobalStore(state => state.toggleSelected);
	const clickSelect = useGlobalStore(state => state.clickSelect);
	const hasCursor = useGlobalStore(state => state.cursorVisible && state.cursor === entry.path);
	const openEntry = useGlobalStore(state => state.openEntry);
	const download = useGlobalStore(state => state.download);
	const openDialog = useGlobalStore(state => state.openDialog);
	const navigate = useGlobalStore(state => state.navigate);

	const isFolder = entry.type === "folder";
	const dragProps = useDraggableEntry(entry);
	const { isOver, dropProps } = useFolderDropTarget(entry.path);

	const rowState = isOver
		? "bg-primary/15 outline-2 -outline-offset-2 outline-primary"
		: selected
			? "bg-primary/10"
			: "hover:bg-base-content/[0.03]";
	const cursorRing = hasCursor && !isOver ? "outline-2 -outline-offset-2 outline-primary/70" : "";

	return (
		<tr
			data-entry-path={entry.path}
			onClick={event => clickSelect(entry.path, event)}
			onDoubleClick={() => openEntry(entry)}
			// A selected row can be dragged from anywhere (moves the whole selection);
			// an unselected one only from its name, so the rest of the row starts a selection box.
			{...(selected ? dragProps : {})}
			{...(isFolder ? dropProps : {})}
			className={`select-none transition-colors ${selected ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${rowState} ${cursorRing} ${isDragged ? "opacity-40" : ""}`}
		>
			<td className="w-0" onClick={stop}>
				<Checkbox checked={selected} onChange={() => toggleSelected(entry.path)} label={t.entries.select(entry.name)} />
			</td>

			<td className="max-w-0 w-full">
				{/* The name area is the drag handle; the rest of the row starts a selection box. */}
				<div {...(selected ? {} : dragProps)} className="flex items-center gap-3 min-w-48 w-fit max-w-full cursor-grab active:cursor-grabbing">
					<Thumbnail entry={entry} className="size-9 rounded-field bg-base-content/5" />

					<div className="flex flex-col min-w-0">
						<button
							onClick={event => {
								stop(event);
								openEntry(entry);
							}}
							className="text-left text-sm font-medium truncate cursor-pointer hover:text-primary hover:underline"
							title={entry.name}
						>
							{entry.name}
						</button>

						{searching && (
							<button
								onClick={event => {
									stop(event);
									navigate(entry.parent);
								}}
								className="flex items-center gap-1 text-left text-xs opacity-60 truncate cursor-pointer hover:opacity-100"
								title={t.location.goToLocation}
							>
								<Icon icon="tabler:folder" width="1em" height="1em" className="shrink-0" />
								<span className="truncate">{entry.parent ? `/${entry.parent}` : "/"}</span>
							</button>
						)}
					</div>
				</div>
			</td>

			<td className="text-nowrap text-sm opacity-60">
				{isFolder ? t.common.items(entry.items ?? 0) : formatBytes(entry.size)}
			</td>
			<td className="text-nowrap text-sm opacity-60 hidden md:table-cell">{formatDate(entry.modificationDate)}</td>
			<td className="text-nowrap text-sm opacity-60 hidden xl:table-cell">{formatDate(entry.creationDate)}</td>

			<td onClick={stop}>
				<div className="flex justify-end items-center">
					<ActionButton
						icon={isFolder ? "tabler:file-zip" : "tabler:download"}
						label={isFolder ? t.common.downloadAsZip : t.common.download}
						onClick={() => download([entry])}
					/>
					<ActionButton icon="tabler:copy" label={t.common.duplicate} onClick={() => openDialog({ kind: "duplicate", entry })} />
					<ActionButton icon="tabler:pencil" label={t.common.rename} onClick={() => openDialog({ kind: "rename", entry })} />
					<ActionButton
						icon="tabler:trash"
						label={t.common.delete}
						danger
						onClick={() => openDialog({ kind: "delete", paths: [entry.path] })}
					/>
				</div>
			</td>
		</tr>
	);
}

export default ({ entries }: { entries: Entry[] }): JSX.Element => {
	const t = useT();
	const sortBy = useGlobalStore(state => state.sortBy);
	const orderBy = useGlobalStore(state => state.orderBy);
	const setSort = useGlobalStore(state => state.setSort);
	const selectedCount = useGlobalStore(state => state.selected.length);
	const setSelected = useGlobalStore(state => state.setSelected);
	const searching = useGlobalStore(state => state.query !== "");

	const allSelected = entries.length > 0 && selectedCount === entries.length;

	return (
		<div className="rounded-box border border-subtle bg-base-100 px-2 pb-2 overflow-x-auto">
			<table className="table table-sm">
				<thead>
					<tr>
						<th className="w-0">
							<Checkbox
								checked={allSelected}
								indeterminate={selectedCount > 0 && !allSelected}
								onChange={() => setSelected(allSelected ? [] : entries.map(entry => entry.path))}
								label={t.entries.selectAll}
							/>
						</th>

						{COLUMNS.map(column => (
							<th key={column.key} className={`py-3 ${column.className ?? ""}`}>
								<button
									onClick={() => setSort(column.key)}
									className="flex items-center gap-1 cursor-pointer hover:text-base-content transition-colors"
								>
									<span>{t.columns[column.label]}</span>
									<SortIcon active={sortBy === column.key} order={orderBy} />
								</button>
							</th>
						))}

						<th className="text-right">{t.columns.actions}</th>
					</tr>
				</thead>

				<tbody>
					{entries.map(entry => (
						<Row key={entry.path} entry={entry} searching={searching} />
					))}
				</tbody>
			</table>
		</div>
	);
};
