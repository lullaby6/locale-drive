/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "virtual:offline-icons" {
	const icons: import("@iconify/react").IconifyJSON;
	export default icons;
}
