import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const distHtml = path.join(rootDir, 'dist/index.html')

function patchReleaseHtml(html: string) {
  // file:// 下需去掉 script 标签的 crossorigin 属性
  return html.replace(/<script type="module"\s+crossorigin>/g, '<script type="module">')
}

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile({ removeViteModuleLoader: true }),
    {
      name: 'release-html-patch',
      transformIndexHtml: {
        order: 'post',
        handler(html, ctx) {
          if (!ctx.bundle) return html
          return patchReleaseHtml(html)
        },
      },
      closeBundle() {
        if (!fs.existsSync(distHtml)) return
        const html = fs.readFileSync(distHtml, 'utf8')
        fs.writeFileSync(distHtml, patchReleaseHtml(html))
      },
    },
  ],
  base: './',
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    modulePreload: false,
  },
})
