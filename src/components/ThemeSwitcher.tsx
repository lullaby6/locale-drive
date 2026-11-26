import { useEffect, useState } from "react";
import type { JSX } from "react";

import Icon from "@/components/Icon";

import type { Translations } from "@/i18n";

type ThemeChoice = "device" | "light" | "dark";

const STORAGE_KEY = "theme";
const SYNC_EVENT = "locale-drive:theme";

function getSavedTheme(): ThemeChoice {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved === "light" || saved === "dark" || saved === "device" ? saved : "device";
	} catch {
		return "device";
	}
}

function applyTheme(choice: ThemeChoice) {
	const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const theme = choice === "device" ? (dark ? "dark" : "light") : choice;
	document.documentElement.setAttribute("data-theme", theme);
}

/** Same control as the app's header: device / light / dark as a button group. */
export default ({ labels, className = "" }: { labels: Translations["nav"]["theme"]; className?: string }): JSX.Element => {
	// "device" on the server render; the saved choice is read once mounted.
	const [theme, setTheme] = useState<ThemeChoice>("device");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setTheme(getSavedTheme());
		setReady(true);

		// The header has two switchers (desktop and phone menu): keep them in sync.
		const onSync = (event: Event) => setTheme((event as CustomEvent<ThemeChoice>).detail);
		window.addEventListener(SYNC_EVENT, onSync);
		return () => window.removeEventListener(SYNC_EVENT, onSync);
	}, []);

	function choose(next: ThemeChoice) {
		setTheme(next);
		window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
	}

	useEffect(() => {
		if (!ready) return;

		applyTheme(theme);
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Private mode: the choice just isn't remembered.
		}

		if (theme !== "device") return;

		const query = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyTheme("device");
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, [theme, ready]);

	const options: { value: ThemeChoice; icon: string; label: string }[] = [
		{ value: "device", icon: "tabler:device-desktop", label: labels.device },
		{ value: "light", icon: "tabler:sun", label: labels.light },
		{ value: "dark", icon: "tabler:moon", label: labels.dark },
	];

	return (
		<div className={`join ${className}`}>
			{options.map(option => (
				<button
					key={option.value}
					className={`btn join-item px-2.5 flex-1 sm:flex-none ${theme === option.value ? "btn-primary" : "btn-subtle"}`}
					onClick={() => choose(option.value)}
					aria-label={option.label}
					aria-pressed={theme === option.value}
					title={option.label}
				>
					<Icon icon={option.icon} className="text-lg" />
				</button>
			))}
		</div>
	);
};
