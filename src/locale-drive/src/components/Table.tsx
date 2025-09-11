import type { JSX } from "react";

import { Icon } from "@iconify/react";

export default (): JSX.Element => {
	return (
		<div className="flex justify-between items-center p-4 rounded shadow-sm border border-base-200 bg-base-300">
			<header className="flex justify-between items-center w-full">
				<label className="input">
					<svg
						className="h-[1em] opacity-50"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<g
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke-width="2.5"
							fill="none"
							stroke="currentColor"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</g>
					</svg>
					<input
						type="search"
						className="grow !focus:!ring-none !focus:!outline-none !focus:!border-none"
						placeholder="Search"
					/>
					<kbd className="kbd kbd-sm">⌘</kbd>
					<kbd className="kbd kbd-sm">K</kbd>
				</label>

				<div className="flex items-center gap-3">
					<button className="btn btn-outline btn-primary">
						<Icon
							icon="tabler:reload"
							width="1em"
							height="1em"
							className="text-xl"
						/>
						Reload
					</button>
					<button className="btn btn-primary">
						<Icon
							icon="tabler:upload"
							width="1em"
							height="1em"
							className="text-xl"
						/>
						Upload
					</button>
				</div>
			</header>
		</div>
	);
};
