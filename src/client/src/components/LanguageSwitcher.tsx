import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { LANGUAGES, useI18n } from "@/i18n";

import type { Language } from "@/i18n";

export default (): JSX.Element => {
	const language = useI18n(state => state.language);
	const t = useI18n(state => state.t);
	const setLanguage = useI18n(state => state.setLanguage);

	function choose(next: Language) {
		setLanguage(next);
		(document.activeElement as HTMLElement | null)?.blur();
	}

	return (
		<div className="dropdown dropdown-end">
			<div
				tabIndex={0}
				role="button"
				className="btn btn-ghost px-2.5 gap-1.5"
				aria-label={t.header.language}
				data-tooltip-id="tooltip"
				data-tooltip-content={t.header.language}
			>
				<Icon icon="tabler:language" width="1em" height="1em" className="text-xl" />
				<span className="text-xs font-semibold uppercase">{language}</span>
			</div>

			<ul tabIndex={0} className="dropdown-content menu gap-1 z-30 w-40 p-1.5 mt-1 rounded-box shadow-xl border border-subtle bg-base-100">
				{(Object.keys(LANGUAGES) as Language[]).map(code => (
					<li key={code}>
						<button onClick={() => choose(code)} className={code === language ? "menu-active" : ""}>
							<span className="w-6 text-xs font-semibold uppercase opacity-60">{code}</span>
							{LANGUAGES[code].languageName}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
