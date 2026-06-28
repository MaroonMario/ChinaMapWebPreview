import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const target = path.resolve(root, '../release/index.html')
const url = `file:///${target.replace(/\\/g, '/')}`

const logs = []
const errors = []

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

page.on('console', (msg) => {
  const entry = `[${msg.type()}] ${msg.text()}`
  logs.push(entry)
  if (msg.type() === 'error') errors.push(entry)
})

page.on('pageerror', (err) => {
  errors.push(`[pageerror] ${err.message}`)
})

await page.goto(url, { waitUntil: 'load', timeout: 30000 })
await page.waitForTimeout(4000)

const rootVisible = await page.locator('#root').evaluate((el) => {
  return el.childElementCount > 0 || el.textContent.trim().length > 0
})

const mapCanvasCount = await page.locator('.map-canvas, .map-wrap canvas').count()

await browser.close()

console.log('URL:', url)
console.log('Root mounted:', rootVisible)
console.log('Map canvas count:', mapCanvasCount)
console.log('Console errors:', errors.length ? errors : '(none)')

if (logs.length) {
  console.log('--- recent console ---')
  logs.slice(-8).forEach((line) => console.log(line))
}

process.exit(errors.length > 0 || !rootVisible ? 1 : 0)
