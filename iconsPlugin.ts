import fs from "node:fs";
import path from "node:path";

import { icons as tabler } from "@iconify-json/tabler";
import { getIcons } from "@iconify/utils";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:offline-icons";
const RESOLVED_ID = "\0" + VIRTUAL_ID;
const ICON_NAME = /["'`]tabler:([a-z0-9-]+)["'`]/g;

function collectIconNames(dir: string, names = new Set<string>()) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) collectIconNames(full, names);
		else if (/\.(tsx?|jsx?|astro)$/.test(entry.name)) {
			for (const match of fs.readFileSync(full, "utf8").matchAll(ICON_NAME)) names.add(match[1]);
		}
	}

	return names;
}

/**
 * Same idea as the Locale Drive web app: bundles only the "tabler:..." icons used in the source,
 * so pages ship a tiny icon set instead of the whole collection (and never call an icon API).
 */
export default function offlineIcons(srcDir: string): Plugin {
	return {
		name: "offline-icons",
		resolveId(id) {
			return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
		},
		load(id) {
			if (id !== RESOLVED_ID) return;

			const names = [...collectIconNames(srcDir)].sort();
			const subset = getIcons(tabler, names);

			const missing = names.filter(name => !subset?.icons[name] && !subset?.aliases?.[name]);
			if (missing.length > 0) this.warn(`Unknown Tabler icons: ${missing.join(", ")}`);

			return `export default ${JSON.stringify(subset)};`;
		},
		handleHotUpdate({ file, server }) {
			if (!file.startsWith(srcDir)) return;

			const module = server.moduleGraph.getModuleById(RESOLVED_ID);
			if (module) server.moduleGraph.invalidateModule(module);
		},
	};
}
