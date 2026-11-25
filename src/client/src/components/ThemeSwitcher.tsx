import { useEffect, useState } from "react";
import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";

type ThemeChoice = "device" | "light" | "dark";

const STORAGE_KEY = "theme";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme(): ThemeChoice {
	const saved = localStorage.getItem(STORAGE_KEY);
	return saved === "light" || saved === "dark" || saved === "device" ? saved : "device";
}

function applyTheme(choice: ThemeChoice) {
	const theme = choice === "device" ? (darkQuery.matches ? "dark" : "light") : choice;
	document.documentElement.setAttribute("data-theme", theme);
}

export default (): JSX.Element => {
	const t = useT();
	const [theme, setTheme] = useState<ThemeChoice>(getSavedTheme);

	useEffect(() => {
		applyTheme(theme);
		localStorage.setItem(STORAGE_KEY, theme);

		if (theme !== "device") return;

		// Follow the OS when it switches between light and dark.
		const onChange = () => applyTheme("device");
		darkQuery.addEventListener("change", onChange);
		return () => darkQuery.removeEventListener("change", onChange);
	}, [theme]);

	const options: { value: ThemeChoice; icon: string; label: string }[] = [
		{ value: "device", icon: "tabler:device-desktop", label: t.header.theme.device },
		{ value: "light", icon: "tabler:sun", label: t.header.theme.light },
		{ value: "dark", icon: "tabler:moon", label: t.header.theme.dark },
	];

	return (
		<div className="join">
			{options.map(option => (
				<button
					key={option.value}
					className={`btn join-item px-2.5 ${theme === option.value ? "btn-primary" : "btn-subtle"}`}
					onClick={() => setTheme(option.value)}
					aria-label={option.label}
					aria-pressed={theme === option.value}
					data-tooltip-id="tooltip"
					data-tooltip-content={option.label}
				>
					<Icon icon={option.icon} width="1em" height="1em" className="text-lg" />
				</button>
			))}
		</div>
	);
};
