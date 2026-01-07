import { useState, useEffect, useRef } from "react";
import {
	Search,
	File,
	Folder,
	EllipsisVertical,
	Download,
	Trash2,
	ExternalLink,
	Upload,
	XIcon,
	LoaderCircle,
	ArrowDownUp,
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	RefreshCcw,
} from "lucide-react";

import { format } from "@formkit/tempo";

import { formatBytes } from "@/utils/file";

import "@/styles/global.css";

import { Toaster } from "@/utils/toaster/toaster.js";
import "@/utils/toaster/toaster.css";

const MODE = import.meta.env.PUBLIC_MODE;
const API_URL =
	MODE === "DEV" ? "http://localhost:3000" : window.location.origin;

export default () => {
	const [data, setData] = useState({});
	const [files, setFiles] = useState([]);
	const [storagePath, setStoragePath] = useState("");
	const [loading, setLoading] = useState(false);

	const [orderBy, setOrderBy] = useState("desc");
	const [sortBy, setSortBy] = useState("modificationDate");

	const [query, setQuery] = useState("");

	const inputFilesRef = useRef(null);

	async function getFiles() {
		if (loading) returns;

		setLoading(true);

		try {
			const params = new URLSearchParams();
            if (query && query.trim() !== "") params.append("q", query);

            params.append("sort", sortBy);
            params.append("order", orderBy);

			const url = `${API_URL}/files?${params.toString()}`;

			const response = await fetch(url);

			if (!response.ok) {
				let message = "Error getting files";

				try {
					const responseData = await response.json();

					message = responseData.message;
				} catch (error) {}

				throw new Error(message);
			}

			const responseData = await response.json();

			setData(responseData);

			setFiles(
				responseData.files.map((file) => {
					return {
						...file,

						modificationDate:
							new Date(
								file.modificationDate
							).toLocaleDateString() +
							" " +
							format(
								new Date(file.modificationDate),
								"YYYY-MM-DD hh:mm"
							).split(" ")[1],

						creationDate:
							new Date(
								file.creationDate
							).toLocaleDateString() +
							" " +
							format(
								new Date(file.creationDate),
								"YYYY-MM-DD hh:mm"
							).split(" ")[1],

						size: formatBytes(file.size),
					};
				})
			);

			setStoragePath(responseData.realPath);
		} catch (error) {
			new Toaster({
				type: "error",
				title: "Error getting file",
				text: error.message,
				position: "bottom-right",
				pauseDurationOnHover: true,
				closeOnClick: true,
				closeOnDrag: true,
				progressBar: true,
				closeButton: {
					onlyShowOnHover: true,
				},
			});
		}

		setLoading(false);
	}

	const [searchTimeout, setSearchTimeout] = useState(null);
	const searchTimeoutDuration = 500;
	const searchRef = useRef(null);

	async function handleSearch(event) {
		if (searchTimeout) {
			clearInterval(searchTimeout);
			setSearchTimeout(null);
		}

		setSearchTimeout(
			setTimeout(() => {
				const value = event.target.value.trim();

				setQuery(value);
			}, searchTimeoutDuration)
		);
	}

	function clearQuery() {
		searchRef.current.value = "";

		if (searchTimeout) {
			clearInterval(searchTimeout);
			setSearchTimeout(null);
		}

		setQuery("");
	}

	useEffect(() => {
		console.log("Query", query);

		getFiles();
	}, [query, sortBy, orderBy]);

	function handleSortChange(column) {
		if (sortBy === column) {
			setOrderBy(orderBy === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setOrderBy("desc");
		}
	}

	function renderSortIcon(column) {
		if (sortBy !== column) {
			return <ArrowDownUp className="size-4 opacity-50 hover:opacity-100 transition-opacity" />;
		}
		return orderBy === "asc" ? (
			<ArrowUpNarrowWide className="size-4" />
		) : (
			<ArrowDownNarrowWide className="size-4" />
		);
	}

	async function deleteFile(fileName) {
		setLoading(true);

		try {
			const response = await fetch(`${API_URL}/file/${fileName}`, {
				method: "DELETE",
			});

			if (response.ok) {
				await getFiles();

				new Toaster({
					type: "success",
					text: "File deleted successfully",
					position: "bottom-right",
					pauseDurationOnHover: true,
					closeOnClick: true,
					closeOnDrag: true,
					progressBar: true,
					closeButton: {
						onlyShowOnHover: true,
					},
				});

				return;
			}

			let message = "Error deleting file";

			try {
				const responseData = await response.json();

				message = responseData.message;
			} catch (error) {}

			throw new Error(message);
		} catch (error) {
			new Toaster({
				type: "error",
				title: "Error deleting file",
				text: error.message,
				position: "bottom-right",
				pauseDurationOnHover: true,
				closeOnClick: true,
				closeOnDrag: true,
				progressBar: true,
				closeButton: {
					onlyShowOnHover: true,
				},
			});
		}

		setLoading(false);
	}

	async function downloadFile(fileName) {
		setLoading(true);

		try {
			const response = await fetch(`${API_URL}/download/${fileName}`);

			if (!response.ok) {
				let message = "Error downloading file";

				try {
					const responseData = await response.json();

					message = responseData.message;
				} catch (error) {}

				throw new Error(message);
			}

			const buffer = await response.arrayBuffer();

			const a = document.createElement("a");
			const blob = new Blob([buffer]);
			a.href = URL.createObjectURL(blob);
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
		} catch (error) {
			new Toaster({
				type: "error",
				title: "Error downloading file",
				text: error.message,
				position: "bottom-right",
				pauseDurationOnHover: true,
				closeOnClick: true,
				closeOnDrag: true,
				progressBar: true,
				closeButton: {
					onlyShowOnHover: true,
				},
			});
		}

		setLoading(false);
	}

	const [debounceTimeouts, setDebounceTimeouts] = useState({});
	const debounceTimeoutDuration = 1000;

	async function renameFile(fileName, newFileName) {
		setLoading(true);

		if (newFileName === fileName || newFileName.trim() === "") {
			return;
		}

		setDebounceTimeouts((prevTimeouts) => {
			if (prevTimeouts[fileName]) {
				clearTimeout(prevTimeouts[fileName]);
			}

			const timeoutID = setTimeout(async () => {
				try {
					const response = await fetch(
						`${API_URL}/rename/${fileName}`,
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								newFilename: newFileName,
							}),
						}
					);

					if (response.ok) {
						await getFiles();

						new Toaster({
							type: "success",
							text: "File renamed successfully",
							position: "bottom-right",
							pauseDurationOnHover: true,
							closeOnClick: true,
							closeOnDrag: true,
							progressBar: true,
							closeButton: {
								onlyShowOnHover: true,
							},
						});

						return;
					}

					let message = "Error renaming file";

					try {
						const responseData = await response.json();

						message = responseData.message;
					} catch (error) {}

					throw new Error(message);
				} catch (error) {
					new Toaster({
						type: "error",
						title: "Error renaming file",
						text: error.message,
						position: "bottom-right",
						pauseDurationOnHover: true,
						closeOnClick: true,
						closeOnDrag: true,
						progressBar: true,
						closeButton: {
							onlyShowOnHover: true,
						},
					});
				}
			}, debounceTimeoutDuration);

			return { ...prevTimeouts, [fileName]: timeoutID };
		});

		setLoading(false);
	}

	async function upload() {
		const inputFile = inputFilesRef.current;

		inputFile.value = null;

		inputFile.click();
	}

	async function handleInputFilesChange(event) {
		setLoading(true);

		const files = event.target.files;

		try {
			const formData = new FormData();
			for (const file of files) {
				formData.append("file", file);
			}

			const response = await fetch(`${API_URL}/upload`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				await getFiles();

				new Toaster({
					type: "success",
					text: "File uploaded successfully",
					position: "bottom-right",
					pauseDurationOnHover: true,
					closeOnClick: true,
					closeOnDrag: true,
					progressBar: true,
					closeButton: {
						onlyShowOnHover: true,
					},
				});

				return;
			}

			let message = "Error uploading file";

			try {
				const responseData = await response.json();

				message = responseData.message;
			} catch (error) {}

			throw new Error(message);
		} catch (error) {
			new Toaster({
				type: "error",
				title: "Error uploading files",
				text: error.message,
				position: "bottom-right",
				pauseDurationOnHover: true,
				closeOnClick: true,
				closeOnDrag: true,
				progressBar: true,
				closeButton: {
					onlyShowOnHover: true,
				},
			});
		}

		setLoading(false);
	}

	async function openStoragePath() {
		setLoading(true);

		try {
			const response = await fetch(`${API_URL}/open`, {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Error opening storage path");
			}
		} catch (error) {
			new Toaster({
				type: "error",
				title: "Error opening storage path",
				text: error.message,
				position: "bottom-right",
				pauseDurationOnHover: true,
				closeOnClick: true,
				closeOnDrag: true,
				progressBar: true,
				closeButton: {
					onlyShowOnHover: true,
				},
			});
		}

		setLoading(false);
	}

	useEffect(() => {
		getFiles();
	}, []);

	return (
		<div className="p-6 lg:p-10 flex flex-col gap-4">
			{loading && (
				<div className="fixed top-0 left-0 w-screen h-screen z-100 flex justify-center items-center">
					<div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50"></div>

					<RefreshCcw className="animate-spin text-white text-4xl size-10" />
				</div>
			)}

			<input
				onChange={handleInputFilesChange}
				ref={inputFilesRef}
				type="file"
				name="files"
				id="files"
				multiple
				className="hidden"
			/>

			<div className="border border-neutral-200 p-4 rounded shadow overflow-hidden flex flex-col gap-2 sm:flex-row justify-between">
				<div>
					<p className="text-sm text-neutral-500">Storage Path:</p>
					<p className="font-semibold">{storagePath}</p>
				</div>

				<button
					onClick={openStoragePath}
					disabled={loading}
					className="w-full lg:w-fit cursor-pointer flex jusify-center items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
					<ExternalLink className="size-4" />
					Open
				</button>
			</div>

			<div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
				<div className="bg-neutral-100 w-full lg:w-1/3 rounded shadow flex justify-start items-center relative">
					<span className="mx-2">
						<Search className="text-neutral-700" />
					</span>
					<input
						ref={searchRef}
						onChange={handleSearch}
						defaultValue={query}
						disabled={loading}
						className="py-2 focus:outline-none w-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
						type="search"
						placeholder="Search files..."
						spellCheck="false"
						autoComplete="false"
					/>

					{searchRef.current?.value.trim() !== "" && (
						<button
							onClick={clearQuery}
							className="absolute top-0 right-0 m-2 cursor-pointer">
							<XIcon className="h-6 text-neutral-700 opacity-50 hover:opacity-100 transition-opacity" />
						</button>
					)}
				</div>

				<div className="flex flex-col lg:flex-row justify-center items-center gap-2 sm:gap-4 w-full lg:w-fit">
					<button
						onClick={getFiles}
						disabled={loading}
						className="w-full lg:w-fit cursor-pointer flex jusify-center items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
						<RefreshCcw className="size-4" />
						Reload
					</button>

					<button
						onClick={upload}
						disabled={loading}
						className="w-full lg:w-fit cursor-pointer flex jusify-center items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded shadow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
						<Upload className="size-4" />
						Upload
					</button>
				</div>
			</div>

			<div className="w-full rounded shadow border border-neutral-200 p-4 lg:p-6 overflow-x-auto">
				<table className="w-full overflow-x-hidden">
					<thead>
						<tr>
							<th className="min-w-[125px] lg:w-[150px] lg:min-w-[150px] font-normal text-center text-nowrap pb-1 font-semibold">
								Actions
							</th>

							<th className="lg:min-w-[400px] font-semibold text-left text-nowrap pl-4 pb-1">
                                <div className="flex items-center justify-start gap-1.5">
                                    <button
                                        onClick={() => handleSortChange('filename')}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span>File Name</span>
                                        {renderSortIcon('filename')}
                                    </button>
                                </div>
                            </th>

							<th className="font-semibold text-left text-nowrap pl-4 pb-1">
                                <div className="flex items-center justify-start gap-1.5">
                                    <button
                                        onClick={() => handleSortChange('size')}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span>Size</span>
                                        {renderSortIcon('size')}
                                    </button>
                                </div>
                            </th>

							<th className="font-semibold text-left text-nowrap pl-4 pb-1">
                                <div className="flex items-center justify-start gap-1.5">
                                    <button
                                        onClick={() => handleSortChange('modificationDate')}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span>Last Modified</span>
                                        {renderSortIcon('modificationDate')}
                                    </button>
                                </div>
                            </th>

							<th className="font-semibold text-left text-nowrap pl-4 pb-1">
                                <div className="flex items-center justify-start gap-1.5">
                                    <button
                                        onClick={() => handleSortChange('creationDate')}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span>Creation Date</span>
                                        {renderSortIcon('creationDate')}
                                    </button>
                                </div>
                            </th>
						</tr>
					</thead>
					<tbody>
						{files.length > 0 &&
							files.map((file) => (
								<tr
									key={file.filename}
									className="border-t border-b border-neutral-200 odd:bg-neutral-100">
									<td className="py-2 text-center">
										<div className="flex justify-center items-center gap-2 w-full">
											<button
												onClick={() =>
													downloadFile(file.filename)
												}
												disabled={loading}
												className="cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
												<Download className="size-4" />
											</button>

											<a
												href={`${API_URL}/storage/${file.filename}`}
												target="_blank">
												<button
													disabled={loading}
													className="cursor-pointer rounded-full bg-cyan-500 hover:bg-cyan-600 text-white p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
													<ExternalLink className="size-4" />
												</button>
											</a>

											<button
												onClick={() =>
													deleteFile(file.filename)
												}
												disabled={loading}
												className="cursor-pointer rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
												<Trash2 className="size-4" />
											</button>
										</div>
									</td>
									<td className="px-1">
										<input
											onChange={(e) =>
												renameFile(
													file.filename,
													e.target.value
												)
											}
											className="w-full focus:outline-none focus:bg-neutral-200 py-2 rounded pl-3 px-2"
											type="text"
											defaultValue={file.filename}
											placeholder="Filename"
											spellCheck="false"
											autoComplete="false"
										/>
									</td>
									<td className="pl-4 py-2 text-nowrap">
										{file.size}
									</td>
									<td className="pl-4 py-2 text-nowrap">
										{file.modificationDate}
									</td>
									<td className="pl-4 py-2 text-nowrap">
										{file.creationDate}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
