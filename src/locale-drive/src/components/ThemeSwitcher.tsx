import { useState, useEffect } from "react";

import { Icon } from "@iconify/react";

export default () => {
	const THEMES = Object.freeze({
		DEVICE: "device",
		LIGHT: "light",
		DARK: "black",
	});

	const [theme, setTheme] = useState(getTheme());

	function setDeviceTheme() {
		const deviceTheme = getDeviceTheme();
		if (deviceTheme === THEMES.DARK) setDarkTheme();
		else setLightTheme();

		setTheme(THEMES.DEVICE);

		localStorage.setItem("theme", THEMES.DEVICE);
	}

	function setLightTheme() {
		document.documentElement.setAttribute("data-theme", THEMES.LIGHT);
		localStorage.setItem("theme", THEMES.LIGHT);
		setTheme(THEMES.LIGHT);
	}

	function setDarkTheme() {
		document.documentElement.setAttribute("data-theme", THEMES.DARK);
		localStorage.setItem("theme", THEMES.DARK);
		setTheme(THEMES.DARK);
	}

	function getDeviceTheme() {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches)
			return THEMES.DARK;
		return THEMES.LIGHT;
	}

	function hasLocalStorageTheme() {
		if (localStorage.getItem("theme")) return true;
		return false;
	}

	function getTheme() {
		if (hasLocalStorageTheme()) return localStorage.getItem("theme");
		return getDeviceTheme();
	}

	useEffect(() => {
		if (hasLocalStorageTheme()) {
			const localTheme = localStorage.getItem("theme");

			if (localTheme === THEMES.DEVICE) return setDeviceTheme();
			else if (localTheme === THEMES.LIGHT) return setLightTheme();
			else if (localTheme === THEMES.DARK) return setDarkTheme();
		}

		const deviceTheme = getDeviceTheme();

		if (deviceTheme === THEMES.LIGHT) return setLightTheme();
		else if (deviceTheme === THEMES.DARK) setDarkTheme();
	}, []);

	return (
		<div className="flex shadow-sm overflow-hidden join">
			<button
				className={`btn join-item px-2.5 ${
					theme == THEMES.DEVICE ? "btn-primary" : ""
				}`}
				onClick={setDeviceTheme}
			>
				<Icon
					icon="mingcute:device-line"
					width="1em"
					height="1em"
					className="text-xl"
				/>
			</button>
			<button
				className={`btn join-item px-2.5 ${
					theme == THEMES.LIGHT ? "btn-primary" : ""
				}`}
				onClick={setLightTheme}
			>
				<Icon icon="tabler:sun" width="1em" height="1em" className="text-xl" />
			</button>
			<button
				className={`btn join-item px-2.5 ${
					theme == THEMES.DARK ? "btn-primary" : ""
				}`}
				onClick={setDarkTheme}
			>
				<Icon icon="tabler:moon" width="1em" height="1em" className="text-xl" />
			</button>
		</div>
	);
};
