import fs from 'node:fs'
import path from 'node:path'

import { icons as tabler } from '@iconify-json/tabler'
import { getIcons } from '@iconify/utils'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:offline-icons'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const ICON_NAME = /["'`]tabler:([a-z0-9-]+)["'`]/g

function collectIconNames(dir: string, names = new Set<string>()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) collectIconNames(full, names)
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      for (const match of fs.readFileSync(full, 'utf8').matchAll(ICON_NAME)) names.add(match[1])
    }
  }

  return names
}

/**
 * Bundles every "tabler:..." icon the app uses, so icons work on a LAN without internet
 * (@iconify/react would otherwise download them from api.iconify.design at runtime).
 * The list is taken from the source code, so new icons are picked up automatically.
 */
export default function offlineIcons(srcDir: string): Plugin {
  return {
    name: 'offline-icons',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const names = [...collectIconNames(srcDir)].sort()
      const subset = getIcons(tabler, names)

      const missing = names.filter(name => !subset?.icons[name] && !subset?.aliases?.[name])
      if (missing.length > 0) this.warn(`Unknown Tabler icons: ${missing.join(', ')}`)

      return `export default ${JSON.stringify(subset)};`
    },
    handleHotUpdate({ file, server }) {
      // Re-scan when a source file changes, so a newly used icon shows up in dev.
      if (!file.startsWith(srcDir)) return

      const module = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) server.moduleGraph.invalidateModule(module)
    },
  }
}
