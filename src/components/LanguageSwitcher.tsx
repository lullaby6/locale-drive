import type { JSX } from "react";

import Icon from "@/components/Icon";
import { LANGUAGES, LANGUAGE_PATHS } from "@/i18n";

import type { Language } from "@/i18n";

interface Props {
	language: Language;
	label: string;
	className?: string;
	buttonClassName?: string;
}

/**
 * Same dropdown as the app's header, but each language is its own page.
 * The link carries ?lang=, and the page's inline script remembers the choice (works without hydration).
 */
export default ({ language, label, className = "", buttonClassName = "btn-ghost px-2.5" }: Props): JSX.Element => (
	<div className={`dropdown dropdown-end ${className}`}>
		<div tabIndex={0} role="button" className={`btn gap-1.5 ${buttonClassName}`} aria-label={label} title={label}>
			<Icon icon="tabler:language" className="text-xl" />
			<span className="text-xs font-semibold uppercase">{language}</span>
		</div>

		<ul tabIndex={0} className="dropdown-content menu gap-1 z-30 w-40 p-1.5 mt-1 rounded-box shadow-xl border border-subtle bg-base-100">
			{(Object.keys(LANGUAGES) as Language[]).map(code => (
				<li key={code}>
					<a href={`${LANGUAGE_PATHS[code]}?lang=${code}`} className={code === language ? "menu-active" : ""} hrefLang={code}>
						<span className="w-6 text-xs font-semibold uppercase opacity-60">{code}</span>
						{LANGUAGES[code].languageName}
					</a>
				</li>
			))}
		</ul>
	</div>
);
