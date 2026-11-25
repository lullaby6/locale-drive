import { formatBytes } from "@/utils/format";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

const en = {
	languageName: "English",

	common: {
		cancel: "Cancel",
		close: "Close",
		download: "Download",
		downloadZip: "Download .zip",
		downloadAsZip: "Download as .zip",
		rename: "Rename",
		duplicate: "Duplicate",
		delete: "Delete",
		open: "Open",
		preview: "Preview",
		openInNewTab: "Open in new tab",
		storage: "Storage",
		files: (count: number) => plural(count, "file", "files"),
		folders: (count: number) => plural(count, "folder", "folders"),
		items: (count: number) => plural(count, "item", "items"),
	},

	header: {
		openTooltip: "Open this folder on the host computer",
		connect: "Connect another device",
		clipboard: "Shared clipboard",
		github: "View on GitHub",
		language: "Language",
		theme: { device: "Device theme", light: "Light theme", dark: "Dark theme" },
	},

	stats: {
		inStorage: (size: string) => `${size} in storage`,
		disk: "Disk",
		diskFree: (free: string, total: string) => `${free} free of ${total}`,
		diskUsed: (percent: number) => `${percent}% of the disk is used`,
	},

	toolbar: {
		searchPlaceholder: "Search in this folder and subfolders...",
		clearSearch: "Clear search",
		listLayout: "List layout",
		gridLayout: "Grid layout",
		sortBy: "Sort by",
		reload: "Reload",
		newFolder: "New folder",
		upload: "Upload",
		sort: {
			"modificationDate:desc": "Last modified (newest)",
			"modificationDate:asc": "Last modified (oldest)",
			"filename:asc": "Name (A → Z)",
			"filename:desc": "Name (Z → A)",
			"size:desc": "Size (largest)",
			"size:asc": "Size (smallest)",
			"creationDate:desc": "Created (newest)",
			"creationDate:asc": "Created (oldest)",
		},
	},

	location: {
		clearSelection: "Clear selection",
		selected: (count: number) => `${count} selected`,
		selectAll: "Select all",
		results: (count: string, query: string) => `${count} results for “${query}”`,
		goToLocation: "Go to location",
	},

	columns: {
		name: "Name",
		size: "Size",
		modified: "Last modified",
		created: "Created",
		actions: "Actions",
	},

	entries: {
		select: (name: string) => `Select ${name}`,
		selectAll: "Select all",
		moreActions: (name: string) => `More actions for ${name}`,
		foldersSection: (count: number) => `Folders (${count})`,
		filesSection: (count: number) => `Files (${count})`,
		dragItems: (count: number) => plural(count, "item", "items"),
	},

	empty: {
		noResults: "No results",
		noResultsHint: (query: string) => `Nothing in this folder or its subfolders matches “${query}”.`,
		folder: "This folder is empty",
		folderHint: "Drag and drop files anywhere on the page, or use the Upload button.",
	},

	drop: {
		title: "Drop files to upload",
		to: "to",
	},

	preview: {
		close: "Close preview",
		previous: "Previous file",
		next: "Next file",
		position: (index: number, total: number) => `${index} of ${total}`,
		truncated: (shown: string, total: string) =>
			`Showing the first ${shown} of ${total}. Download the file to see all of it.`,
		emptyFile: "(empty file)",
		noPreview: "No preview available",
		cantPlay: "This file can't be played in the browser",
		couldNotLoad: "Could not load this file",
	},

	upload: {
		uploading: (files: number, percent: number) => `Uploading ${plural(files, "file", "files")} · ${percent}%`,
		finished: "Uploads finished",
		processing: "Processing...",
		progress: (loaded: string, total: string, speed: string, eta: string) =>
			`${loaded} of ${total} · ${speed}/s${eta ? ` · ${eta}` : ""}`,
		secondsLeft: (seconds: number) => `${seconds}s left`,
		minutesLeft: (minutes: number) => `${minutes} min left`,
		hoursLeft: (hours: string) => `${hours} h left`,
		done: (size: string) => `${size} · Done`,
		failed: "Upload failed",
		canceled: "Canceled",
		cancel: "Cancel upload",
		dismiss: "Dismiss",
	},

	dialogs: {
		newFolderTitle: "New folder",
		defaultFolderName: "New folder",
		create: "Create",
		renameTitle: "Rename",
		deleteTitle: "Delete permanently?",
		deleteBody: (label: string) => `${label} will be deleted from the host computer. This cannot be undone.`,
		deleteFoldersWarning: "Folders are deleted with everything inside them.",
		duplicateTitle: "Duplicate?",
		duplicateBody: (name: string) => `A copy of “${name}” will be created in the same folder.`,
		duplicateFolderHint: "The folder is copied with everything inside it.",
		validation: {
			empty: "Name cannot be empty",
			tooLong: "Name is too long",
			invalidChars: 'Name cannot contain < > : " / \\ | ? *',
			trailing: "Name cannot end with a dot or a space",
		},
	},

	shortcuts: {
		title: "Keyboard shortcuts",
		button: "Keyboard shortcuts",
		hint: "Shortcuts work while you are not typing in a text field.",
		then: "then",
		groups: { selection: "Selection", navigation: "Navigation", actions: "Actions" },
		selectAll: "Select everything in this folder",
		clearSelection: "Clear the selection",
		move: "Move between files and folders",
		extend: "Extend the selection",
		moveCursor: "Move without changing the selection",
		toggle: "Select or unselect the current item",
		firstLast: "Go to the first or last item",
		open: "Open folder or preview file",
		parent: "Go to the parent folder",
		search: "Search",
		delete: "Delete",
		rename: "Rename",
		duplicate: "Duplicate",
		download: "Download (.zip for several items)",
		newFolder: "New folder",
		upload: "Upload files",
		toggleView: "Switch between list and grid",
		help: "Show this list",
	},

	notFound: {
		code: "404",
		pageTitle: "Page not found",
		pageBody: "The page you are looking for doesn't exist or was moved.",
		folderTitle: "Folder not found",
		folderBody: (path: string) => `“${path}” doesn't exist anymore. It may have been moved, renamed or deleted.`,
		back: "Go to Storage",
	},

	connection: {
		offlineTitle: "Can't connect to the server",
		offlineBody: "Make sure Locale Drive is still running on the host computer and that this device is on the same network.",
		retrying: "Trying again automatically...",
		retryNow: "Retry now",
		lost: "Connection to the server lost. Trying to reconnect...",
		reconnected: "Connected again",
		networkError: "Can't reach the server. Check your connection.",
	},

	qr: {
		title: "Connect another device",
		hint: "Scan this code with a phone or tablet connected to the same Wi-Fi network.",
		copyLink: "Copy link",
		copied: "Link copied",
		copyFailed: "Could not copy the link",
	},

	clipboard: {
		title: "Shared clipboard",
		hint: "Paste text or a link here and press Share: it shows up instantly on every connected device.",
		placeholder: "Paste something to share...",
		clear: "Clear",
		copy: "Copy",
		share: "Share",
		unsaved: "Unsaved changes",
		sharedAt: (date: string) => `Shared ${date}`,
		nothingShared: "Nothing shared yet",
		pasteFromDevice: "Paste from this device",
		copiedToDevice: "Copied to this device's clipboard",
		copyFailed: "Could not copy. Select the text and copy it manually",
		pasteDenied: "Clipboard access was denied",
	},

	toasts: {
		folderCreated: (name: string) => `Folder “${name}” created`,
		renamed: "Renamed successfully",
		deleted: (count: number) => (count === 1 ? "Deleted successfully" : `${count} items deleted`),
		moved: (count: number, folder: string) =>
			`${count === 1 ? "1 item" : `${count} items`} moved to “${folder}”`,
		duplicated: (name: string) => `Duplicated as “${name}”`,
		uploaded: (count: number) => (count === 1 ? "File uploaded successfully" : `${count} files uploaded successfully`),
		preparingZip: "Preparing .zip download...",
		tooLargeSkipped: (count: number, max: string) =>
			`${plural(count, "file", "files")} skipped: the max upload size is ${max}`,
		foldersSkipped: (count: number) =>
			`${plural(count, "folder", "folders")} skipped: drop files, or create the folder first`,
		clipboardUpdated: "Shared clipboard updated",
		genericError: "Something went wrong",
	},

	kinds: {
		folder: "Folder",
		image: "Image",
		video: "Video",
		audio: "Audio",
		pdf: "PDF",
		document: "Document",
		spreadsheet: "Spreadsheet",
		presentation: "Presentation",
		archive: "Archive",
		code: "Code",
		text: "Text",
		font: "Font",
		executable: "Application",
		android: "Android app",
		disk: "Disk image",
		file: "File",
	},

	/** Errors sent by the server, matched by their `code`. */
	errors: {
		INVALID_PATH: () => "Invalid path",
		INVALID_REQUEST: () => "Invalid request",
		NAME_EMPTY: () => "Name cannot be empty",
		NAME_TOO_LONG: (params: { max?: number }) => `Name cannot be longer than ${params.max ?? 255} characters`,
		NAME_INVALID_CHARS: () => 'Name cannot contain any of these characters: < > : " / \\ | ? *',
		NAME_RESERVED: (params: { name?: string }) => `“${params.name}” is a reserved name`,
		NAME_TRAILING: () => "Name cannot end with a dot or a space",
		NOT_FOUND: () => "File or folder not found",
		NOT_A_FOLDER: () => "That path is not a folder",
		IS_A_FOLDER: () => "That action is not available for folders",
		ALREADY_EXISTS: (params: { name?: string }) => `“${params.name}” already exists in this folder`,
		MOVE_INTO_ITSELF: (params: { name?: string }) => `Cannot move “${params.name}” into itself`,
		ROOT_PROTECTED: () => "The storage folder itself cannot be changed",
		NOTHING_SELECTED: () => "Nothing selected",
		FILE_TOO_LARGE: (params: { max?: number }) => `File is too large. The max upload size is ${formatBytes(params.max ?? 0)}`,
		CLIPBOARD_TOO_LONG: (params: { max?: number }) => `Text is too long (max ${params.max ?? 0} characters)`,
	},
};

export type Translations = typeof en;

export default en;
