import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import monkey, { util } from 'vite-plugin-monkey'
import tsconfigPaths from 'vite-tsconfig-paths'

import type { Plugin } from 'vite'

// import { localesMeta } from './config/locales/meta'
import { getScriptInfos, printScriptInfos } from './scripts/script-infos'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const scriptInfos = await getScriptInfos()
  const allMatches = scriptInfos.flatMap((script) => {
    if ('matches' in script) {
      return script.matches
    }
    return []
  })
  const allIncludes = scriptInfos.flatMap((script) => {
    if ('includes' in script) {
      return script.includes
    }
    return []
  })

  printScriptInfos(scriptInfos)

  return {
    plugins: [
      tsconfigPaths(),
      autoImport({
        imports: [
          'react',
          util.unimportPreset,
          {
            'tagged-classnames-free': ['cls', 'tw'],
          },
          {
            '@/helpers/ui/integrated': ['createIntegratedUi'],
            '@/helpers/ui/shadow-root': ['createShadowRootUi'],
            '@/helpers/react/shadow-root-helpers': ['reactRenderInShadowRoot'],
          },
          {
            from: '@/helpers/ui/shadow-root.ts',
            imports: ['ShadowRootUi'],
            type: true,
          },
        ],
      }),
      react(),
      tailwindcss(),
      monkey({
        entry: 'src/main.ts',
        userscript: {
          name: 'GoVetUCCollection',
          description: 'Govet UserScript Collection',
          icon: 'https://avatars.githubusercontent.com/u/124812342?v=4',
          namespace: 'https://github.com/goveteth',
          match: allMatches,
          include: allIncludes,
          grant: ['GM_xmlhttpRequest', 'GM_download'],
          updateURL: 'https://github.com/goveteth/us-collection/raw/main/dist/govet-us-collection.user.js',
          downloadURL: 'https://github.com/goveteth/us-collection/raw/main/dist/govet-us-collection.user.js',
          connect: ['github.com', 'deepwiki.com'],
          noframes: true,
          license: 'MIT',
        },
        build: {
          externalGlobals: {
            'react': [
              'React',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react.umd.min.js`
              },
            ],
            'react-dom': [
              'ReactDOM',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react-dom.umd.min.js`
              },
            ],
            'react-dom/client': [
              'ReactDOMClient',
              (version: string, name: string, importName: string) => {
                return `https://cdn.jsdelivr.net/npm/react-umd@${version}/dist/react-dom-client.umd.min.js`
              },
            ],
          },
        },
        server: {
          mountGmApi: true,
          open: false,
        },
      }),
      // ref: https://github.com/lisonge/vite-plugin-monkey/issues/156
      {
        name: 'replace-unsafeWindow',
        apply: 'build',
        transform(code, id) {
          if (id.includes('@monaco-editor/loader/lib/es/loader/index.js')) {
            return `import {unsafeWindow as window} from '$';\n${code}`
          }
        },
      } satisfies Plugin,
    ],
  }
})
