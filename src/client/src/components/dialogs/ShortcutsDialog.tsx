import { Fragment } from "react";
import type { JSX } from "react";

import Modal from "@/components/Modal";
import { isMac } from "@/hooks/useKeyboardShortcuts";
import { useT } from "@/i18n";

import type { Translations } from "@/languages/en";

const MOD = isMac ? "⌘" : "Ctrl";

type Label = Exclude<keyof Translations["shortcuts"], "title" | "button" | "hint" | "then" | "groups">;

/** Each shortcut is a list of alternatives; each alternative is a list of keys pressed together. */
const GROUPS: { group: keyof Translations["shortcuts"]["groups"]; items: { keys: string[][]; label: Label }[] }[] = [
	{
		group: "selection",
		items: [
			{ keys: [[MOD, "A"]], label: "selectAll" },
			{ keys: [["Esc"]], label: "clearSelection" },
			{ keys: [["Shift", "↑ ↓ ← →"], ["Shift", "Home / End"]], label: "extend" },
			{ keys: [[MOD, "↑ ↓ ← →"]], label: "moveCursor" },
			{ keys: [["Space"]], label: "toggle" },
		],
	},
	{
		group: "navigation",
		items: [
			{ keys: [["↑ ↓ ← →"]], label: "move" },
			{ keys: [["Home"], ["End"]], label: "firstLast" },
			{ keys: [["Enter"]], label: "open" },
			{ keys: [["Backspace"], ["Alt", "↑"]], label: "parent" },
			{ keys: [["/"], [MOD, "K"]], label: "search" },
		],
	},
	{
		group: "actions",
		items: [
			{ keys: isMac ? [["⌘", "Backspace"], ["Delete"]] : [["Delete"]], label: "delete" },
			{ keys: [["F2"]], label: "rename" },
			{ keys: [[MOD, "D"]], label: "duplicate" },
			{ keys: [[MOD, "S"]], label: "download" },
			{ keys: [["Shift", "N"]], label: "newFolder" },
			{ keys: [["Shift", "U"]], label: "upload" },
			{ keys: [["V"]], label: "toggleView" },
			{ keys: [["?"]], label: "help" },
		],
	},
];

function Keys({ keys }: { keys: string[][] }) {
	return (
		<span className="flex flex-wrap justify-end items-center gap-1.5">
			{keys.map((combo, index) => (
				<Fragment key={index}>
					{index > 0 && <span className="text-xs opacity-50">/</span>}
					<span className="flex items-center gap-1">
						{combo.map(key => (
							<kbd key={key} className="kbd kbd-sm">
								{key}
							</kbd>
						))}
					</span>
				</Fragment>
			))}
		</span>
	);
}

export default ({ onClose }: { onClose: () => void }): JSX.Element => {
	const t = useT();

	return (
		<Modal title={t.shortcuts.title} icon="tabler:keyboard" onClose={onClose} className="sm:max-w-2xl">
			<p className="text-sm opacity-70 -mt-1">{t.shortcuts.hint}</p>

			<div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
				{GROUPS.map(({ group, items }) => (
					<section key={group} className="flex flex-col gap-1">
						<h4 className="text-xs font-semibold uppercase tracking-wide opacity-50 mb-1">{t.shortcuts.groups[group]}</h4>
						<ul className="flex flex-col divide-y divide-base-content/5">
							{items.map(item => (
								<li key={item.label} className="flex justify-between items-center gap-4 py-2 text-sm">
									<span>{t.shortcuts[item.label]}</span>
									<Keys keys={item.keys} />
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</Modal>
	);
};
