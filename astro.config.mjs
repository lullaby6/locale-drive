// @ts-check
import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import offlineIcons from "./iconsPlugin.ts";

// https://astro.build/config
// Public path of the built site. GitHub Pages serves it under /<repo>/ (set by the workflow via
// ASTRO_BASE); otherwise the root.
export default defineConfig({
	site: "https://lullaby6.github.io",
	base: process.env.ASTRO_BASE || "/",
	integrations: [react()],
	server: { port: 3000 },
	i18n: {
		locales: ["en", "es"],
		defaultLocale: "en",
		routing: { prefixDefaultLocale: false },
	},
	vite: {
		plugins: [tailwindcss(), offlineIcons(fileURLToPath(new URL("./src", import.meta.url)))],
	},
});
