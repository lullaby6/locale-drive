import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useFolderDropTarget } from "@/hooks/useEntryDrag";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { splitPath } from "@/utils/utils";

/** A breadcrumb that also accepts dropped items, to move them up to that folder. */
function Crumb({ path, label, icon, current }: { path: string; label: string; icon: string; current: boolean }) {
	const navigate = useGlobalStore(state => state.navigate);
	const { isOver, dropProps } = useFolderDropTarget(path);

	return (
		<li>
			<button
				{...dropProps}
				onClick={() => navigate(path)}
				className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-field cursor-pointer max-w-48 transition-colors ${
					isOver ? "bg-primary/20 text-primary ring-2 ring-inset ring-primary" : "hover:text-primary"
				} ${current ? "font-semibold" : "opacity-70 hover:opacity-100"}`}
				title={label}
			>
				<Icon icon={icon} width="1em" height="1em" className="shrink-0 text-base" />
				<span className="truncate">{label}</span>
			</button>
		</li>
	);
}

function Breadcrumbs(): JSX.Element {
	const t = useT();
	const dir = useGlobalStore(state => state.dir);

	const segments = splitPath(dir);

	return (
		// Scrolls sideways only when a deep path really doesn't fit.
		<div className="breadcrumbs text-sm py-0 min-w-0 overflow-y-hidden">			<ul>
				<Crumb path="" label={t.common.storage} icon="tabler:home" current={segments.length === 0} />
				{segments.map((segment, index) => (
					<Crumb
						key={index}
						path={segments.slice(0, index + 1).join("/")}
						label={segment}
						icon="tabler:folder"
						current={index === segments.length - 1}
					/>
				))}
			</ul>
		</div>
	);
}

function SelectionActions(): JSX.Element {
	const t = useT();
	const selected = useGlobalStore(state => state.selected);
	const entries = useGlobalStore(state => state.entries);
	const loading = useGlobalStore(state => state.loading);
	const download = useGlobalStore(state => state.download);
	const openDialog = useGlobalStore(state => state.openDialog);
	const setSelected = useGlobalStore(state => state.setSelected);
	const clearSelection = useGlobalStore(state => state.clearSelection);

	const selectedEntries = entries.filter(entry => selected.includes(entry.path));
	const allSelected = selected.length === entries.length;
	const singleFile = selectedEntries.length === 1 && selectedEntries[0].type === "file";

	return (
		<div className="flex flex-wrap items-center gap-2">
			<button
				onClick={clearSelection}
				className="btn btn-ghost btn-circle btn-sm"
				aria-label={t.location.clearSelection}
				data-tooltip-id="tooltip"
				data-tooltip-content={t.location.clearSelection}
			>
				<Icon icon="tabler:x" width="1em" height="1em" className="text-lg" />
			</button>

			<span className="text-sm font-semibold mr-1">{t.location.selected(selected.length)}</span>

			{!allSelected && (
				<button onClick={() => setSelected(entries.map(entry => entry.path))} className="btn btn-subtle btn-sm">
					<Icon icon="tabler:checks" width="1em" height="1em" className="text-lg" />
					{t.location.selectAll}
				</button>
			)}

			<button onClick={() => download(selectedEntries)} disabled={loading} className="btn btn-primary btn-sm">
				<Icon icon={singleFile ? "tabler:download" : "tabler:file-zip"} width="1em" height="1em" className="text-lg" />
				{singleFile ? t.common.download : t.common.downloadZip}
			</button>

			<button
				onClick={() => openDialog({ kind: "delete", paths: selected })}
				disabled={loading}
				className="btn btn-subtle btn-sm text-error"
			>
				<Icon icon="tabler:trash" width="1em" height="1em" className="text-lg" />
				{t.common.delete}
			</button>
		</div>
	);
}

export default (): JSX.Element => {
	const t = useT();
	const hasSelection = useGlobalStore(state => state.selected.length > 0);
	const query = useGlobalStore(state => state.query);
	const count = useGlobalStore(state => state.entries.length);
	const truncated = useGlobalStore(state => state.truncated);
	const fetching = useGlobalStore(state => state.fetching);

	return (
		<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 min-h-14 px-4 py-2 rounded-box border border-subtle bg-base-100">
			<div className="flex items-center gap-3 min-w-0">
				<Breadcrumbs />

				{query && (
					<span className="badge badge-soft badge-primary text-nowrap">
						{t.location.results(truncated ? `${count}+` : String(count), query)}
					</span>
				)}

				{fetching && <span className="loading loading-spinner loading-xs text-primary" />}
			</div>

			{hasSelection && <SelectionActions />}
		</div>
	);
};
