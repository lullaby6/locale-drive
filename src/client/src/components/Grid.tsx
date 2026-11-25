import type { JSX } from "react";

import { Icon } from "@iconify/react";

import Checkbox from "@/components/Checkbox";
import EntryIcon from "@/components/EntryIcon";
import EntryMenu from "@/components/EntryMenu";
import Thumbnail from "@/components/Thumbnail";
import { useDraggableEntry, useFolderDropTarget } from "@/hooks/useEntryDrag";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { formatBytes, formatDate } from "@/utils/utils";

import type { Entry } from "@/types";

const GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3";

function SelectBox({ entry, selected, visible }: { entry: Entry; selected: boolean; visible: boolean }) {
	const t = useT();
	const toggleSelected = useGlobalStore(state => state.toggleSelected);

	return (
		<Checkbox
			checked={selected}
			onChange={() => toggleSelected(entry.path)}
			onClick={event => event.stopPropagation()}
			label={t.entries.select(entry.name)}
			className={`transition-opacity ${visible || selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
		/>
	);
}

function cardClasses(selected: boolean, isOver: boolean, isDragged: boolean, hasCursor = false) {
	const state = isOver
		? "border-primary bg-primary/15 ring-2 ring-primary"
		: selected
			? "border-primary/60 bg-primary/10"
			: "border-subtle bg-base-100 hover:bg-base-200";

	const cursorRing = hasCursor && !isOver ? "ring-2 ring-primary/70" : "";

	return `group relative rounded-box border cursor-pointer select-none transition-colors ${state} ${cursorRing} ${isDragged ? "opacity-40" : ""}`;
}

function useCardState(entry: Entry) {
	const selected = useGlobalStore(state => state.selected.includes(entry.path));
	const isDragged = useGlobalStore(state => state.dragging.includes(entry.path));
	const openEntry = useGlobalStore(state => state.openEntry);
	const clickSelect = useGlobalStore(state => state.clickSelect);
	const hasCursor = useGlobalStore(state => state.cursorVisible && state.cursor === entry.path);

	return { selected, isDragged, openEntry, clickSelect, hasCursor };
}

function FolderCard({ entry, selecting }: { entry: Entry; selecting: boolean }): JSX.Element {
	const t = useT();
	const { selected, isDragged, openEntry, clickSelect, hasCursor } = useCardState(entry);
	const dragProps = useDraggableEntry(entry);
	const { isOver, dropProps } = useFolderDropTarget(entry.path);

	return (
		<div
			data-entry-path={entry.path}
			{...dragProps}
			{...dropProps}
			onClick={event => (selecting || event.shiftKey ? clickSelect(entry.path, event) : openEntry(entry))}
			className={`${cardClasses(selected, isOver, isDragged, hasCursor)} flex items-center gap-2 py-2 pl-3 pr-1`}
			title={entry.name}
		>
			<SelectBox entry={entry} selected={selected} visible={selecting} />
			<EntryIcon entry={entry} className="text-2xl" />

			<div className="flex flex-col min-w-0 grow">
				<span className="text-sm font-medium truncate">{entry.name}</span>
				<span className="text-xs opacity-60 truncate">{t.common.items(entry.items ?? 0)}</span>
			</div>

			<EntryMenu entry={entry} />
		</div>
	);
}

function FileCard({ entry, selecting, searching }: { entry: Entry; selecting: boolean; searching: boolean }): JSX.Element {
	const { selected, isDragged, openEntry, clickSelect, hasCursor } = useCardState(entry);
	const dragProps = useDraggableEntry(entry);

	return (
		<div
			data-entry-path={entry.path}
			{...dragProps}
			onClick={event => (selecting || event.shiftKey ? clickSelect(entry.path, event) : openEntry(entry))}
			className={`${cardClasses(selected, false, isDragged, hasCursor)} flex flex-col p-2 gap-2`}
			title={entry.name}
		>
			<div className="relative aspect-[4/3] rounded-field overflow-hidden bg-base-content/5">
				<Thumbnail entry={entry} className="w-full h-full" iconClassName="text-6xl" />

				<div className="absolute top-2 left-2">
					<SelectBox entry={entry} selected={selected} visible={selecting} />
				</div>
			</div>

			<div className="flex items-center gap-2 pl-1">
				<EntryIcon entry={entry} className="text-lg" />

				<div className="flex flex-col min-w-0 grow">
					<span className="text-sm font-medium truncate">{entry.name}</span>
					<span className="text-xs opacity-60 truncate">
						{searching
							? entry.parent ? `/${entry.parent}` : "/"
							: `${formatBytes(entry.size)} · ${formatDate(entry.modificationDate)}`}
					</span>
				</div>

				<EntryMenu entry={entry} />
			</div>
		</div>
	);
}

function Section({ title, icon, children }: { title: string; icon: string; children: JSX.Element[] }) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="flex items-center gap-2 text-sm font-medium opacity-60">
				<Icon icon={icon} width="1em" height="1em" />
				{title}
			</h2>
			<div className={GRID}>{children}</div>
		</section>
	);
}

/** Google Drive style layout: folders on top as compact cards, files below with big previews. */
export default ({ entries }: { entries: Entry[] }): JSX.Element => {
	const t = useT();
	const selecting = useGlobalStore(state => state.selected.length > 0);
	const searching = useGlobalStore(state => state.query !== "");

	const folders = entries.filter(entry => entry.type === "folder");
	const files = entries.filter(entry => entry.type === "file");

	return (
		<div className="flex flex-col gap-6 rounded-box border border-subtle bg-base-100 p-4">
			{folders.length > 0 && (
				<Section title={t.entries.foldersSection(folders.length)} icon="tabler:folder">
					{folders.map(entry => (
						<FolderCard key={entry.path} entry={entry} selecting={selecting} />
					))}
				</Section>
			)}

			{files.length > 0 && (
				<Section title={t.entries.filesSection(files.length)} icon="tabler:files">
					{files.map(entry => (
						<FileCard key={entry.path} entry={entry} selecting={selecting} searching={searching} />
					))}
				</Section>
			)}
		</div>
	);
};
