#!/usr/bin/env node
import { rm, mkdir, cp, readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import { execSync } from 'child_process'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

console.log('Cleaning dist...')
await rm(resolve(root, 'dist'), { recursive: true, force: true })
await mkdir(resolve(root, 'dist'))

console.log('Building JS...')
execSync('npx rollup -c', { stdio: 'inherit', cwd: root })

console.log('Building CSS...')
const css = await readFile(resolve(root, 'src/vegas.css'), 'utf8')
await writeFile(resolve(root, 'dist/vegas.css'), css)

console.log('Minifying CSS...')
const postcssResult = await postcss([ autoprefixer(), cssnano() ]).process(css, {
  from: resolve(root, 'dist/vegas.css'),
  to: resolve(root, 'dist/vegas.min.css'),
  map: { inline: false }
})
await writeFile(resolve(root, 'dist/vegas.min.css'), postcssResult.css)
if (postcssResult.map) {
  await writeFile(resolve(root, 'dist/vegas.min.css.map'), postcssResult.map.toString())
}

console.log('Copying overlays...')
await cp(resolve(root, 'src/overlays'), resolve(root, 'dist/overlays'), { recursive: true })

console.log('Build complete!')
