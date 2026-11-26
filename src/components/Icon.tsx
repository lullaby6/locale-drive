import type { JSX } from "react";

import { getIconData, iconToSVG } from "@iconify/utils";
import icons from "virtual:offline-icons";

interface Props {
	/** Tabler icon id with its prefix, like in the app. */
	icon: string;
	className?: string;
	label?: string;
}

/** Inline Tabler icon, rendered at build time (no runtime icon loading), sized with font-size like @iconify/react's 1em icons. */
export default ({ icon, className = "", label }: Props): JSX.Element | null => {
	const data = getIconData(icons, icon.replace(/^tabler:/, ""));
	if (!data) return null;

	const { attributes, body } = iconToSVG(data, { height: "1em", width: "1em" });

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...attributes}
			className={`shrink-0 ${className}`}
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			dangerouslySetInnerHTML={{ __html: body }}
		/>
	);
};
