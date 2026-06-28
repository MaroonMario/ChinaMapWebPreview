import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const releaseDir = path.resolve(root, '../release')

const distHtml = path.resolve(root, '../dist/index.html')
const favicon = path.resolve(root, '../public/favicon.svg')

if (!fs.existsSync(distHtml)) {
  console.error('dist/index.html 不存在，请先运行 npm run build')
  process.exit(1)
}

fs.rmSync(releaseDir, { recursive: true, force: true })
fs.mkdirSync(releaseDir, { recursive: true })

fs.copyFileSync(distHtml, path.join(releaseDir, 'index.html'))
fs.copyFileSync(favicon, path.join(releaseDir, 'favicon.svg'))

fs.writeFileSync(
  path.join(releaseDir, '使用说明.txt'),
  [
    '中国地图 · 认位置练习',
    '',
    '使用方法：双击 index.html 即可，无需安装 Node。',
    '',
    '功能：',
    '- 探索：悬停/点击各省查看信息',
    '- 测验：认位置练习',
    '- 壁纸：全屏地图',
    '',
    '将整个文件夹拷贝给他人即可使用。',
  ].join('\n'),
  'utf8',
)

console.log(`已生成可分发文件夹：${releaseDir}`)
console.log('拷贝 release/ 整个文件夹给他人，双击 index.html 即可。')
