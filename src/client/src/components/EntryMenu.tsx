import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import { getFileUrl } from "@/services/files";
import useGlobalStore from "@/store/global";

import type { Entry } from "@/types";

function closeDropdown() {
	(document.activeElement as HTMLElement | null)?.blur();
}

interface Props {
	entry: Entry;
	className?: string;
}

/** "⋮" menu with every action for a file or folder. */
export default ({ entry, className = "" }: Props): JSX.Element => {
	const t = useT();
	const openEntry = useGlobalStore(state => state.openEntry);
	const download = useGlobalStore(state => state.download);
	const openDialog = useGlobalStore(state => state.openDialog);

	const isFolder = entry.type === "folder";

	function run(action: () => void) {
		return () => {
			closeDropdown();
			action();
		};
	}

	return (
		<div className={`dropdown dropdown-end ${className}`} onClick={event => event.stopPropagation()}>
			<div
				tabIndex={0}
				role="button"
				className="btn btn-ghost btn-circle btn-sm opacity-60 hover:opacity-100"
				aria-label={t.entries.moreActions(entry.name)}
			>
				<Icon icon="tabler:dots-vertical" width="1em" height="1em" className="text-lg" />
			</div>

			<ul tabIndex={0} className="dropdown-content menu gap-0.5 z-30 w-56 p-1.5 mt-1 rounded-box shadow-xl border border-subtle bg-base-100">
				<li>
					<button onClick={run(() => openEntry(entry))}>
						<Icon icon={isFolder ? "tabler:folder-open" : "tabler:eye"} width="1em" height="1em" />
						{isFolder ? t.common.open : t.common.preview}
					</button>
				</li>
				{!isFolder && (
					<li>
						<a href={getFileUrl(entry.path)} target="_blank" rel="noreferrer" onClick={closeDropdown}>
							<Icon icon="tabler:external-link" width="1em" height="1em" />
							{t.common.openInNewTab}
						</a>
					</li>
				)}
				<li>
					<button onClick={run(() => download([entry]))}>
						<Icon icon={isFolder ? "tabler:file-zip" : "tabler:download"} width="1em" height="1em" />
						{isFolder ? t.common.downloadAsZip : t.common.download}
					</button>
				</li>
				<li>
					<button onClick={run(() => openDialog({ kind: "duplicate", entry }))}>
						<Icon icon="tabler:copy" width="1em" height="1em" />
						{t.common.duplicate}
					</button>
				</li>
				<li>
					<button onClick={run(() => openDialog({ kind: "rename", entry }))}>
						<Icon icon="tabler:pencil" width="1em" height="1em" />
						{t.common.rename}
					</button>
				</li>
				<li>
					<button className="text-error" onClick={run(() => openDialog({ kind: "delete", paths: [entry.path] }))}>
						<Icon icon="tabler:trash" width="1em" height="1em" />
						{t.common.delete}
					</button>
				</li>
			</ul>
		</div>
	);
};
