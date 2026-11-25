import { useEffect, useRef, useState } from "react";
import type { FormEvent, JSX } from "react";

import Modal from "@/components/Modal";
import { useT } from "@/i18n";

import type { Translations } from "@/languages/en";

const INVALID_CHARS = /[<>:"/\\|?*\u0000-\u001F]/;

/** Mirrors the server rules so most mistakes are caught before sending the request. */
function validate(name: string, t: Translations) {
	const trimmed = name.trim();

	if (trimmed === "" || trimmed === "." || trimmed === "..") return t.dialogs.validation.empty;
	if (trimmed.length > 255) return t.dialogs.validation.tooLong;
	if (INVALID_CHARS.test(trimmed)) return t.dialogs.validation.invalidChars;
	if (/[. ]$/.test(trimmed)) return t.dialogs.validation.trailing;

	return null;
}

interface Props {
	title: string;
	icon: string;
	submitLabel: string;
	initialValue?: string;
	/** Select only the name part, not the extension (like a file explorer). */
	selectBaseName?: boolean;
	/** Renaming to the same name just closes the dialog. Creating always submits. */
	closeIfUnchanged?: boolean;
	onSubmit: (name: string) => Promise<boolean>;
	onClose: () => void;
}

export default ({
	title,
	icon,
	submitLabel,
	initialValue = "",
	selectBaseName = false,
	closeIfUnchanged = false,
	onSubmit,
	onClose,
}: Props): JSX.Element => {
	const t = useT();
	const [value, setValue] = useState(initialValue);
	const [touched, setTouched] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;

		input.focus();

		const dot = initialValue.lastIndexOf(".");
		input.setSelectionRange(0, selectBaseName && dot > 0 ? dot : initialValue.length);
	}, [initialValue, selectBaseName]);

	const error = validate(value, t);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setTouched(true);

		if (error || submitting) return;
		if (closeIfUnchanged && value.trim() === initialValue) return onClose();

		setSubmitting(true);
		const ok = await onSubmit(value.trim());
		setSubmitting(false);

		if (ok) onClose();
	}

	return (
		<Modal title={title} icon={icon} onClose={onClose}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<label className="flex flex-col gap-1">
					<input
						ref={inputRef}
						value={value}
						onChange={event => {
							setValue(event.target.value);
							setTouched(true);
						}}
						className={`input w-full ${touched && error ? "input-error" : ""}`}
						spellCheck={false}
						autoComplete="off"
						aria-invalid={Boolean(touched && error)}
					/>
					<span className={`text-xs text-error min-h-4 ${touched && error ? "" : "invisible"}`}>{error}</span>
				</label>

				<div className="flex justify-end gap-2">
					<button type="button" onClick={onClose} className="btn btn-subtle">
						{t.common.cancel}
					</button>
					<button type="submit" disabled={Boolean(error) || submitting} className="btn btn-primary">
						{submitting && <span className="loading loading-spinner loading-sm" />}
						{submitLabel}
					</button>
				</div>
			</form>
		</Modal>
	);
};
