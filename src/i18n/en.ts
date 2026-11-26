const en = {
	languageName: "English",

	meta: {
		title: "Locale Drive · Your own Google Drive on your local network",
		description:
			"Share and transfer files between every device on your Wi-Fi from a browser. No accounts, no cloud, no app on the other devices. Free and open source.",
	},

	nav: {
		features: "Features",
		howItWorks: "How it works",
		screenshots: "Screenshots",
		download: "Download",
		faq: "FAQ",
		github: "View on GitHub",
		npm: "View on npm",
		language: "Language",
		menu: "Menu",
		theme: { device: "Device theme", light: "Light theme", dark: "Dark theme" },
	},

	hero: {
		badge: "Free and open source · MIT",
		title: "A Google Drive for your local network",
		subtitle:
			"Share a folder from your computer and open it from any phone, tablet or laptop on the same Wi-Fi. Browse, upload, download and organize files from the browser: no accounts, no cloud, nothing to install on the other devices.",
		download: "Download for Windows",
		npm: "Install with npm",
		version: "Version",
		note: "Windows 10/11 app, or any OS with Node.js",
		pills: ["No accounts", "No cloud", "Works without internet", "Only a browser on other devices"],
	},

	concept: {
		title: "One computer shares, every device opens it",
		subtitle:
			"Locale Drive is not a send-to-device app. Your computer becomes a small file server for one folder, and any device on the network opens it like a website.",
		host: {
			title: "Your computer",
			body: "Runs Locale Drive and shares one folder. Files stay on its disk.",
		},
		network: {
			title: "Same Wi-Fi / LAN",
			body: "Everything travels over your local network, at its full speed.",
		},
		devices: {
			title: "Any device",
			body: "Phones, tablets, laptops, TVs... they only need a web browser.",
		},
	},

	how: {
		title: "How it works",
		subtitle: "Three steps, zero configuration.",
		steps: [
			{
				title: "Start Locale Drive",
				body: "Open the desktop app, or run npx locale-drive in a terminal. It opens the shared folder in your browser.",
			},
			{
				title: "Scan the QR code",
				body: "Click Connect another device and scan the code with your phone, or type the address it shows.",
			},
			{
				title: "Share files",
				body: "Upload, download, preview, move and organize files from any device. Changes show up everywhere at once.",
			},
		],
	},

	screenshots: {
		title: "Take a look",
		subtitle: "The same app on every device, in light or dark theme. Click a screenshot to enlarge it.",
		tabs: {
			list: "List",
			grid: "Grid",
			preview: "Preview",
			connect: "Connect",
			mobile: "Phone",
		},
		captions: {
			list: "List layout with sizes and dates, bulk actions and a storage summary.",
			grid: "Google Drive style grid with image and video thumbnails.",
			preview: "Full-screen previews for images, video, audio, PDFs and text. Use ← → to move between files.",
			connect: "Connect another device by scanning a QR code.",
			mobile: "On phones it adapts with a grid view and a bottom action bar.",
		},
		enlarge: "Enlarge screenshot",
		close: "Close",
		previous: "Previous screenshot",
		next: "Next screenshot",
	},

	features: {
		title: "Features",
		subtitle: "Everything you expect from a file explorer, in the browser of every device.",
		items: [
			{ icon: "tabler:folders", title: "Folders and breadcrumbs", body: "Create folders, browse them with breadcrumbs and go back with the browser button." },
			{ icon: "tabler:drag-drop", title: "Drag and drop", body: "Drop files anywhere to upload them, or onto a folder. Drag items onto folders to move them." },
			{ icon: "tabler:select-all", title: "Selection like your explorer", body: "Box selection, Shift+click ranges, checkboxes, and Ctrl/Cmd to add to the selection." },
			{ icon: "tabler:keyboard", title: "Keyboard shortcuts", body: "Ctrl+A, arrows, Enter, Backspace, Delete, F2 and more. Press ? in the app to see them all." },
			{ icon: "tabler:layout-grid", title: "List and grid layouts", body: "Rows with details, or a grid with thumbnails. Your choice is remembered." },
			{ icon: "tabler:eye", title: "Previews", body: "Images, video, audio, PDFs and text or code files open in a full-screen viewer." },
			{ icon: "tabler:file-zip", title: "Bulk downloads", body: "Download several files or whole folders as a single .zip, or delete them together." },
			{ icon: "tabler:upload", title: "Upload progress", body: "Speed, time left and a cancel button for every upload." },
			{ icon: "tabler:refresh-dot", title: "Live updates", body: "Changes from any device, or made directly in the folder, appear everywhere without reloading." },
			{ icon: "tabler:clipboard-text", title: "Shared clipboard", body: "Paste text or a link on one device and copy it on another." },
			{ icon: "tabler:qrcode", title: "Connect with a QR code", body: "Shown in the terminal and in the app, so phones connect in seconds." },
			{ icon: "tabler:wifi-off", title: "Works without internet", body: "Everything, icons included, is served by your computer. Perfect for an offline LAN." },
			{ icon: "tabler:player-play", title: "Resumable downloads", body: "HTTP range requests let downloads resume and videos seek." },
			{ icon: "tabler:database", title: "Storage info", body: "Number of files and folders, space used and free disk space." },
			{ icon: "tabler:language", title: "English and Spanish", body: "Picked from the device language, and switchable from the header." },
			{ icon: "tabler:moon", title: "Light, dark and device themes", body: "Follows your system or the theme you pick." },
		],
	},

	download: {
		title: "Download",
		subtitle: "Pick the desktop app for Windows, or run it anywhere with Node.js.",
		recommended: "Recommended",
		installer: {
			title: "Installer",
			body: "Installs Locale Drive and adds it to the Start menu. It runs from the notification area, next to the clock.",
			button: "Download installer",
		},
		portable: {
			title: "Portable",
			body: "No installation: unzip it anywhere, even on a USB drive, and open Locale Drive.exe.",
			button: "Download portable",
		},
		npm: {
			title: "npm",
			body: "For Windows, macOS and Linux. Needs Node.js and runs from the terminal.",
			button: "See npm instructions",
		},
		allReleases: "All releases and changelog",
		desktopNotes: {
			title: "About the desktop app",
			items: [
				"Requires Windows 10 or 11. Node.js is included, you don't need to install it.",
				"The first time it opens, Windows Firewall asks whether node may use the network: allow it on private networks, or other devices won't be able to connect.",
				"Files are stored in Documents\\Locale Drive.",
				"Click the tray icon to open the page again. Right click → Exit stops the server.",
			],
		},
	},

	npmGuide: {
		title: "Install with npm",
		subtitle: (node: string) => `Works on Windows, macOS and Linux. Requires Node.js ${node} or newer.`,
		steps: [
			{ title: "Install it globally", body: "Adds the locale-drive command to your terminal." },
			{ title: "Share a folder", body: "Prints the LAN address and a QR code, and opens the app in your browser." },
			{ title: "Or run it without installing", body: "npx downloads and runs the latest version." },
		],
		defaultFolder: "If you don't pass a path, Locale Drive uses ./storage in the current directory and creates it if needed.",
		terminalTitle: "Terminal",
		optionsTitle: "Options",
		columns: { option: "Option", alias: "Alias", default: "Default", description: "Description" },
		options: [
			{ option: "--port", alias: "-p", default: "24680", description: "Port the server listens on." },
			{ option: "--max-upload", alias: "-m", default: "0", description: "Max size per uploaded file, in MB. 0 means no limit." },
			{ option: "--no-open", alias: "", default: "", description: "Don't open the browser on start." },
			{ option: "--help", alias: "", default: "", description: "Show all options." },
		],
		examplesTitle: "Examples",
		examples: [
			{ comment: "Share ~/Videos on port 8080", command: "locale-drive ~/Videos --port 8080" },
			{ comment: "Limit uploads to 500 MB per file and don't open the browser", command: "locale-drive ./shared -m 500 --no-open" },
		],
		portsTitle: "Ports",
		ports:
			"Port 24680 is used by default. If it's taken, the next free port is used, and the terminal, the QR code and the app always show the port in use. If you pass --port and it's taken, Locale Drive stops with a message instead.",
		copy: "Copy",
		copied: "Copied",
	},

	security: {
		title: "Only on networks you trust",
		body: "Anyone on your network who opens the address can read, upload, move and delete files in the shared folder. Run Locale Drive at home, in the office or on your own hotspot, not on public Wi-Fi.",
	},

	faq: {
		title: "Frequently asked questions",
		items: [
			{
				q: "Is it free?",
				a: "Yes. Locale Drive is free and open source under the MIT license. No ads, no tracking, no accounts.",
			},
			{
				q: "Do the other devices need to install anything?",
				a: "No. Only the computer that shares the folder runs Locale Drive. Phones, tablets and other computers just open the address in a web browser.",
			},
			{
				q: "Does it work over the internet?",
				a: "No, and that's on purpose. It works between devices connected to the same Wi-Fi or local network, and keeps working if that network has no internet access.",
			},
			{
				q: "Where are my files stored?",
				a: "In the folder you share, on the computer running Locale Drive. The desktop app uses Documents\\Locale Drive; with npm you choose the folder. Nothing is uploaded to any cloud.",
			},
			{
				q: "How is it different from file-sending apps?",
				a: "Send-to-device apps push files from one device to another, and every device needs the app. Locale Drive shares a folder that every device can browse at the same time from a browser, like a small Google Drive on your LAN.",
			},
			{
				q: "Other devices can't connect. What do I check?",
				a: "Make sure they're on the same network, that Windows Firewall allows node on private networks, and that you're using the address or QR code shown by the app (the port may change if 24680 is taken).",
			},
			{
				q: "Is there a size limit for files?",
				a: "No limit by default. With npm you can set one per file with --max-upload (in MB).",
			},
		],
	},

	footer: {
		tagline: "Share and transfer files across your local network, from any browser.",
		product: "Product",
		project: "Project",
		license: "MIT License",
		issues: "Report a bug",
		desktopRepo: "Desktop app repository",
		madeBy: "Made by",
	},

	copy: "Copy",
	copied: "Copied",
};

export type Translations = typeof en;

export default en;
