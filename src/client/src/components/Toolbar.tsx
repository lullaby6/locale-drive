import { useRef, useState } from "react";
import type { ChangeEvent, JSX } from "react";

import { Icon } from "@iconify/react";

import useGlobalStore from "@/store/global";

const SEARCH_DEBOUNCE = 500;

export default (): JSX.Element => {
	const loading = useGlobalStore(state => state.loading);
	const setQuery = useGlobalStore(state => state.setQuery);
	const fetchFiles = useGlobalStore(state => state.fetchFiles);
	const uploadFiles = useGlobalStore(state => state.uploadFiles);

	const [hasValue, setHasValue] = useState(false);

	const searchRef = useRef<HTMLInputElement>(null);
	const inputFilesRef = useRef<HTMLInputElement>(null);
	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value.trim();

		setHasValue(event.target.value !== "");

		if (searchTimeout.current) clearTimeout(searchTimeout.current);

		searchTimeout.current = setTimeout(() => {
			setQuery(value);
		}, SEARCH_DEBOUNCE);
	}

	function clearQuery() {
		if (searchRef.current) searchRef.current.value = "";

		if (searchTimeout.current) clearTimeout(searchTimeout.current);

		setHasValue(false);
		setQuery("");
	}

	function openFilePicker() {
		const input = inputFilesRef.current;
		if (!input) return;

		input.value = "";
		input.click();
	}

	function handleInputFilesChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		uploadFiles(files);
	}

	return (
		<div className="flex flex-col lg:flex-row justify-between items-center gap-3 p-4 rounded shadow-sm border border-base-300 bg-base-100">
			<input
				ref={inputFilesRef}
				onChange={handleInputFilesChange}
				type="file"
				name="files"
				id="files"
				multiple
				className="hidden"
			/>

			<label className="input w-full lg:w-1/3">
				<Icon
					icon="tabler:search"
					width="1em"
					height="1em"
					className="opacity-50"
				/>
				<input
					ref={searchRef}
					onChange={handleSearch}
					disabled={loading}
					type="search"
					className="grow"
					placeholder="Search files..."
					spellCheck={false}
					autoComplete="off"
				/>
				{hasValue && (
					<button
						onClick={clearQuery}
						className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
						aria-label="Clear search"
					>
						<Icon icon="tabler:x" className="text-xl" />
					</button>
				)}
			</label>

			<div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-fit">
				<button
					onClick={fetchFiles}
					disabled={loading}
					className="btn btn-outline btn-primary w-full lg:w-fit"
				>
					<Icon
						icon="tabler:reload"
						width="1em"
						height="1em"
						className="text-xl"
					/>
					Reload
				</button>

				<button
					onClick={openFilePicker}
					disabled={loading}
					className="btn btn-primary w-full lg:w-fit"
				>
					<Icon
						icon="tabler:upload"
						width="1em"
						height="1em"
						className="text-xl"
					/>
					Upload
				</button>
			</div>
		</div>
	);
};
