/// <reference types="astro/client" />

declare module "virtual:offline-icons" {
	import type { IconifyJSON } from "@iconify/types";
	const icons: IconifyJSON;
	export default icons;
}
