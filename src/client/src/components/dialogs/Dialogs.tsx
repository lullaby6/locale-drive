import { useState } from "react";
import type { JSX, ReactNode } from "react";

import { Icon } from "@iconify/react";

import Modal from "@/components/Modal";
import ClipboardDialog from "@/components/dialogs/ClipboardDialog";
import NameDialog from "@/components/dialogs/NameDialog";
import QrDialog from "@/components/dialogs/QrDialog";
import ShortcutsDialog from "@/components/dialogs/ShortcutsDialog";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";

import type { Entry } from "@/types";

interface ConfirmProps {
	title: string;
	icon: string;
	confirmLabel: string;
	confirmIcon: string;
	danger?: boolean;
	onConfirm: () => Promise<boolean>;
	onClose: () => void;
	children: ReactNode;
}

function ConfirmDialog({ title, icon, confirmLabel, confirmIcon, danger = false, onConfirm, onClose, children }: ConfirmProps): JSX.Element {
	const t = useT();
	const [busy, setBusy] = useState(false);

	async function handleConfirm() {
		setBusy(true);
		const ok = await onConfirm();
		setBusy(false);
		if (ok) onClose();
	}

	return (
		<Modal
			title={title}
			icon={icon}
			onClose={onClose}
			actions={
				<>
					<button onClick={onClose} className="btn btn-subtle">
						{t.common.cancel}
					</button>
					<button onClick={handleConfirm} disabled={busy} className={`btn ${danger ? "btn-error" : "btn-primary"}`} autoFocus>
						{busy ? <span className="loading loading-spinner loading-sm" /> : <Icon icon={confirmIcon} width="1em" height="1em" />}
						{confirmLabel}
					</button>
				</>
			}
		>
			{children}
		</Modal>
	);
}

function DeleteDialog({ paths, onClose }: { paths: string[]; onClose: () => void }): JSX.Element {
	const t = useT();
	const entries = useGlobalStore(state => state.entries);
	const deleteEntries = useGlobalStore(state => state.deleteEntries);

	const targets = entries.filter(entry => paths.includes(entry.path));
	const hasFolders = targets.some(entry => entry.type === "folder");
	const label = targets.length === 1 ? `“${targets[0].name}”` : t.common.items(paths.length);

	return (
		<ConfirmDialog
			title={t.dialogs.deleteTitle}
			icon="tabler:trash"
			confirmLabel={t.common.delete}
			confirmIcon="tabler:trash"
			danger
			onConfirm={() => deleteEntries(paths)}
			onClose={onClose}
		>
			<p className="break-words">{t.dialogs.deleteBody(label)}</p>
			{hasFolders && (
				<p className="flex items-center gap-2 text-sm text-warning">
					<Icon icon="tabler:alert-triangle" width="1em" height="1em" className="shrink-0" />
					{t.dialogs.deleteFoldersWarning}
				</p>
			)}
		</ConfirmDialog>
	);
}

function DuplicateDialog({ entry, onClose }: { entry: Entry; onClose: () => void }): JSX.Element {
	const t = useT();
	const duplicateEntry = useGlobalStore(state => state.duplicateEntry);

	return (
		<ConfirmDialog
			title={t.dialogs.duplicateTitle}
			icon="tabler:copy"
			confirmLabel={t.common.duplicate}
			confirmIcon="tabler:copy"
			onConfirm={() => duplicateEntry(entry)}
			onClose={onClose}
		>
			<p className="break-words">{t.dialogs.duplicateBody(entry.name)}</p>
			{entry.type === "folder" && (
				<p className="flex items-center gap-2 text-sm opacity-70">
					<Icon icon="tabler:info-circle" width="1em" height="1em" className="shrink-0" />
					{t.dialogs.duplicateFolderHint}
				</p>
			)}
		</ConfirmDialog>
	);
}

/** Renders whichever dialog the store says is open. */
export default (): JSX.Element | null => {
	const t = useT();
	const dialog = useGlobalStore(state => state.dialog);
	const closeDialog = useGlobalStore(state => state.closeDialog);
	const createFolder = useGlobalStore(state => state.createFolder);
	const renameEntry = useGlobalStore(state => state.renameEntry);

	if (!dialog) return null;

	switch (dialog.kind) {
		case "newFolder":
			return (
				<NameDialog
					title={t.dialogs.newFolderTitle}
					icon="tabler:folder-plus"
					submitLabel={t.dialogs.create}
					initialValue={t.dialogs.defaultFolderName}
					onSubmit={createFolder}
					onClose={closeDialog}
				/>
			);
		case "rename":
			return (
				<NameDialog
					title={t.dialogs.renameTitle}
					icon="tabler:pencil"
					submitLabel={t.common.rename}
					initialValue={dialog.entry.name}
					selectBaseName={dialog.entry.type === "file"}
					closeIfUnchanged
					onSubmit={name => renameEntry(dialog.entry, name)}
					onClose={closeDialog}
				/>
			);
		case "duplicate":
			return <DuplicateDialog entry={dialog.entry} onClose={closeDialog} />;
		case "delete":
			return <DeleteDialog paths={dialog.paths} onClose={closeDialog} />;
		case "qr":
			return <QrDialog onClose={closeDialog} />;
		case "shortcuts":
			return <ShortcutsDialog onClose={closeDialog} />;
		case "clipboard":
			return <ClipboardDialog onClose={closeDialog} />;
	}
};
