# Locale Drive Website

Landing page for [Locale Drive](https://github.com/lullaby6/locale-drive): what it is, how it works, screenshots, and downloads (Windows installer, portable, and npm).

Built with Astro, React, Tailwind CSS and daisyUI, using the same themes, components and icons as the web app ([locale-drive-frontend](https://github.com/lullaby6/locale-drive-frontend)).

## Development

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in dist/
npm run preview
```

## Deploy

This code lives in the `website` branch of [locale-drive](https://github.com/lullaby6/locale-drive).
Every push to `website` runs [.github/workflows/deploy-website.yml](.github/workflows/deploy-website.yml):
it builds the site with `ASTRO_BASE=/locale-drive/` and publishes `dist/` to the `website-dist` branch,
which GitHub Pages serves at https://lullaby6.github.io/locale-drive/.

To preview that build locally (in PowerShell): `$env:ASTRO_BASE="/locale-drive/"; npm run build`.

## Where things live

```
src/
├── config.ts              # Version, download links and repository URLs
├── i18n/                  # English (/) and Spanish (/es/) texts
├── styles/global.css      # daisyUI themes copied from the web app
├── assets/screenshots/    # <view>-<language>-<theme>.png, taken from the real app
├── components/
│   ├── Landing.astro      # All page sections
│   ├── Header.astro
│   ├── Screenshots.tsx    # Tabs + full-screen viewer (React island)
│   ├── ThemeSwitcher.tsx  # Device / light / dark, like the app
│   └── ...
└── pages/                 # index.astro (en) and es/index.astro
```

The download buttons don't hardcode any version or file name. [src/release.ts](src/release.ts) asks the GitHub API
for the latest release of locale-drive and picks the asset ending in `setup.exe` (installer) and the one ending in
`portable.zip` (portable). It runs at build time, so the HTML already has the right links, and again in the browser,
so a new release shows up without rebuilding the site. If an asset can't be found, its button opens the latest
release page.

Icons are Tabler icons, bundled at build time by `iconsPlugin.ts` (only the ones used in `src/`).
