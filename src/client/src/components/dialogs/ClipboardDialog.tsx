import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import Modal from "@/components/Modal";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { copyText, formatDate } from "@/utils/utils";

const canReadClipboard = Boolean(navigator.clipboard?.readText) && window.isSecureContext;

/** Text shared between every device connected to the server: paste on one, copy on another. */
export default ({ onClose }: { onClose: () => void }): JSX.Element => {
	const t = useT();
	const clipboard = useGlobalStore(state => state.clipboard);
	const loading = useGlobalStore(state => state.loading);
	const saveClipboard = useGlobalStore(state => state.saveClipboard);

	const [draft, setDraft] = useState(clipboard.text);
	const syncedText = useRef(clipboard.text);

	// Show text shared from other devices live, unless the user is in the middle of editing.
	useEffect(() => {
		const previous = syncedText.current;
		syncedText.current = clipboard.text;
		setDraft(current => (current === previous ? clipboard.text : current));
	}, [clipboard.text]);

	const dirty = draft !== clipboard.text;

	async function handleCopy() {
		try {
			await copyText(draft);
			toast.success(t.clipboard.copiedToDevice);
		} catch {
			toast.error(t.clipboard.copyFailed);
		}
	}

	async function handlePaste() {
		try {
			setDraft(await navigator.clipboard.readText());
		} catch {
			toast.error(t.clipboard.pasteDenied);
		}
	}

	return (
		<Modal
			title={t.clipboard.title}
			icon="tabler:clipboard-text"
			onClose={onClose}
			className="sm:max-w-2xl"
			actions={
				<>
					<button onClick={() => saveClipboard("")} disabled={loading || clipboard.text === ""} className="btn btn-ghost">
						<Icon icon="tabler:eraser" width="1em" height="1em" className="text-lg" />
						{t.clipboard.clear}
					</button>
					<button onClick={handleCopy} disabled={draft === ""} className="btn btn-subtle">
						<Icon icon="tabler:copy" width="1em" height="1em" className="text-lg" />
						{t.clipboard.copy}
					</button>
					<button onClick={() => saveClipboard(draft)} disabled={loading || !dirty} className="btn btn-primary">
						<Icon icon="tabler:share" width="1em" height="1em" className="text-lg" />
						{t.clipboard.share}
					</button>
				</>
			}
		>
			<p className="text-sm opacity-70">{t.clipboard.hint}</p>

			<textarea
				value={draft}
				onChange={event => setDraft(event.target.value)}
				className="textarea w-full h-56 font-mono text-sm"
				placeholder={t.clipboard.placeholder}
				spellCheck={false}
				autoFocus
			/>

			<div className="flex justify-between items-center gap-2 text-xs opacity-70 -mt-2">
				<span>
					{dirty
						? t.clipboard.unsaved
						: clipboard.updatedAt
							? t.clipboard.sharedAt(formatDate(clipboard.updatedAt))
							: t.clipboard.nothingShared}
				</span>

				{canReadClipboard && (
					<button onClick={handlePaste} className="btn btn-ghost btn-xs">
						<Icon icon="tabler:clipboard" width="1em" height="1em" />
						{t.clipboard.pasteFromDevice}
					</button>
				)}
			</div>
		</Modal>
	);
};
