import type { JSX } from "react";

import { Icon } from "@iconify/react";

import ThemeSwitcher from "@/components/ThemeSwitcher";

export default (): JSX.Element => {
	return (
		<div className="flex justify-between items-center p-4 rounded shadow-sm border border-base-200 bg-base-300">
			<div className="flex items-center gap-3 pr-3 rounded bg-base-200">
				<button className="btn btn-primary">
					<Icon
						icon="tabler:folder-share"
						width="1em"
						height="1em"
						className="text-xl"
					/>
					Open
				</button>

				<p className="font-semibold">
					C:\Users\Luciano\Documents\Code\locale-drive\storage
				</p>
			</div>

			<ThemeSwitcher />
		</div>
	);
};
