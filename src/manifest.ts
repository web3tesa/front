import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: packageData.displayName,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
    "default_title": "Click to open panel"
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  side_panel: {
    default_path: 'sidepanel.html'
  },
  content_scripts: [
    {
      matches:
        ['https://dexscreener.com/*', 'https://tesa-chi.vercel.app/*'],
      js: ['src/contentScript/src/main.tsx'],
      run_at: 'document_end'
    },
    {
      matches:
        // ['http://localhost/*', ] ,
        []
      ,
      js: ['src/contentScript/tesa.ts'],
      run_at: "document_end"
    }
  ],
  host_permissions: ['https://io.dexscreener.com/*', 'https://dexscreener.com/*'],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['storage', 'sidePanel'],
})
