# Locale Drive

A web-based app to share and transfer files across your local network, like a "Google Drive" for your LAN, built with Express.js and React.

Run one command on your computer, scan the QR code with your phone, and every device on the same Wi-Fi can browse, upload, download and organize the files in that folder. No accounts, no cloud, no install on the other devices: they only need a browser.

**Website: https://lullaby6.github.io/locale-drive/** (how it works, screenshots and downloads).

## Features

- **Folders**: create folders, browse them with breadcrumbs, and use the browser back button to go up.
- **Drag and drop**:
  - Drop files anywhere on the page to upload them, or onto a folder to upload them straight into it.
  - Drag files and folders onto other folders, or onto a breadcrumb, to move them.
- **Selection like your file explorer**: click and drag on empty space to select several items with a box, Shift+click to select a range, or use the checkboxes. Ctrl/Cmd/Shift add to the selection.
- **Keyboard shortcuts**: Ctrl+A, Esc, arrow keys (with Shift to extend the selection), Enter to open, Backspace to go up, Delete, F2 to rename, and more. Press `?` in the app to see the full list.
- **List and grid layouts**: rows with details, or a Google Drive style grid with thumbnails. Phones start in grid view and desktops in list view, and your choice is remembered.
- **Previews**: images, video, audio, PDFs and text/code files open in a full-screen viewer. Use ← → to move between files.
- **File type icons** and image/video thumbnails.
- **Bulk actions**: download several files or whole folders as a single `.zip`, or delete them together.
- **Rename, duplicate and delete**, with confirmation dialogs.
- **Upload progress**: speed, time left and a cancel button for each upload.
- **Live updates**: changes made from any device, or directly in the folder on the host computer, show up on every open tab without reloading.
- **Shared clipboard**: paste text or a link on one device and copy it on another.
- **Connect with a QR code**, shown both in the terminal and in the app.
- **Storage info**: number of files and folders, space used, and free disk space.
- **Resumable downloads and video seeking** through HTTP range requests.
- **English and Spanish**: picked from your device language, and you can switch it from the header.
- **Light, dark and device themes.**
- **Works without internet**: everything, icons included, is served by your computer, so it works on a local network with no internet access.
- **Connection feedback**: if the server stops, a banner says so and the app reconnects and catches up on its own when it's back.

## Installation

### Desktop app (Windows)

Download it from the [releases](https://github.com/lullaby6/locale-drive/releases/latest) or the [website](https://lullaby6.github.io/locale-drive/#download):

- **Installer** (`Locale Drive_x.x.x_x64-setup.exe`): installs Locale Drive and adds it to the Start menu.
- **Portable** (`Locale Drive_x.x.x_x64-portable.zip`): unzip it anywhere and open `Locale Drive.exe`.

The app runs from the notification area (next to the clock) and opens Locale Drive in your browser. It includes Node.js, so nothing else is needed. Requires Windows 10 or 11; the first time, allow `node` on private networks when Windows Firewall asks, so other devices can connect. Files are stored in `Documents\Locale Drive`.

### npm (Windows, macOS and Linux)

```bash
npm install -g locale-drive
```

Requires Node.js 22.12 or newer.

## Usage

Share a folder:

```bash
locale-drive /path/to/storage
```

Or run it without installing:

```bash
npx locale-drive /path/to/storage
```

The server prints its LAN address and a QR code, and opens the app in your browser. Open that address (or scan the QR code) from any device on the same network.

If you don't pass a path, Locale Drive uses `./storage` in the current directory and creates it if needed.

### Options

| Option | Alias | Default | Description |
| --- | --- | --- | --- |
| `--port` | `-p` | `24680` | Port the server listens on. |
| `--max-upload` | `-m` | `0` | Max size per uploaded file, in MB. `0` means no limit. |
| `--no-open` | | | Don't open the browser on start. |
| `--help` | | | Show all options. |

Examples:

```bash
# Share ~/Videos on port 8080
locale-drive ~/Videos --port 8080

# Limit uploads to 500 MB per file and don't open the browser
locale-drive ./shared -m 500 --no-open
```

### Ports

Locale Drive uses port `24680` by default, an uncommon port chosen so it doesn't clash with other apps.

- If you don't pass `--port` and `24680` is taken, it tries the next ports (`24681`, `24682`...) and, if needed, any free port. The terminal, the QR code and the app's "Connect another device" dialog always show the port actually in use.
- If you pass `--port` and that port is taken, it stops with a message instead of silently using another one.

> **Note:** anyone on your network who opens the address can read, upload, move and delete files in the shared folder. Only run it on networks you trust.

## Development

Locale Drive is split across these repositories and branches:

| Where | What it is |
| --- | --- |
| [locale-drive](https://github.com/lullaby6/locale-drive) (this repository, `main`) | The Express server, the CLI and the npm package. It serves the built web app from `src/public`. Desktop builds are published in its [releases](https://github.com/lullaby6/locale-drive/releases). |
| [locale-drive-frontend](https://github.com/lullaby6/locale-drive-frontend) | The web app every device opens: React + Vite + Tailwind CSS + daisyUI. Included here as a git submodule in `locale-drive-frontend/`. |
| [locale-drive-tauri](https://github.com/lullaby6/locale-drive-tauri) | The Windows desktop app (Tauri). It runs this server with a bundled Node.js from the notification area, and builds the installer and the portable `.zip`. Includes this repository as a submodule. |
| [`website`](https://github.com/lullaby6/locale-drive/tree/website) branch | The [website](https://lullaby6.github.io/locale-drive/): Astro + React + daisyUI, with the same look as the app. Each push builds it into the `website-dist` branch, which GitHub Pages serves. |

To work on the server and the web app together:

```bash
git clone --recursive https://github.com/lullaby6/locale-drive.git
cd locale-drive
npm run setup
npm run dev
```

`npm run setup` fetches the submodule (in case you cloned without `--recursive`) and installs the dependencies of both projects.

`npm run dev` starts both parts with live reload:

- the Express API on port `24680` (restarts when the server code changes), and
- the Vite dev server for the web app on port `3001`, which forwards `/api` and `/storage` to the API.

Open http://localhost:3001 while developing.

To build the web app into `src/public` (the version that `npm start` and the published package serve):

```bash
npm run build
```

Commit the updated `src/public` together with the new submodule commit, so both always match.

### Updating the web app

After pushing changes to the frontend repository, point this repository to the new version:

```bash
cd locale-drive-frontend && git pull origin main && cd ..
npm run build
git add locale-drive-frontend src/public
git commit -m "Update web app"
```

### Project structure

```
locale-drive-frontend/  # Web app (git submodule): React + Vite + Tailwind CSS + daisyUI
src/
├── index.js        # CLI entry point: starts Express and serves the built web app
├── config.js       # Command line options
├── routes.js       # API routes under /api
├── controllers.js
├── services/       # Files, live events (SSE) and shared clipboard
├── middlewares/    # Uploads and error handling
├── utils/
└── public/         # Built web app (generated by `npm run build`)
```

Translations (English and Spanish) live in the frontend repository, in `src/languages/`. See its README to add a language.

## License

[MIT](https://github.com/lullaby6/locale-drive/blob/main/LICENSE)
