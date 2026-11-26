import { useEffect, useState } from "react";
import type { JSX } from "react";

import Icon from "@/components/Icon";

async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		// Fallback for http pages and older browsers, like the app's copyText.
		const area = document.createElement("textarea");
		area.value = text;
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.appendChild(area);
		area.select();
		document.execCommand("copy");
		area.remove();
	}
}

interface Props {
	text: string;
	label: string;
	copiedLabel: string;
	className?: string;
}

/** Copies a command; the icon turns into a check for a moment. */
export default ({ text, label, copiedLabel, className = "btn btn-ghost btn-square btn-sm" }: Props): JSX.Element => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 1800);
		return () => clearTimeout(timeout);
	}, [copied]);

	return (
		<button
			type="button"
			className={className}
			onClick={async () => {
				await copyText(text);
				setCopied(true);
			}}
			aria-label={copied ? copiedLabel : label}
			title={copied ? copiedLabel : label}
		>
			<Icon icon={copied ? "tabler:check" : "tabler:copy"} className={`text-lg ${copied ? "text-success" : ""}`} />
		</button>
	);
};
