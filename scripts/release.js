#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { execSync, spawnSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createWriteStream } from 'fs'
import { readdir, readFile } from 'fs/promises'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import archiver from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Parse args
const args = process.argv.slice(2)
const typeIdx = args.indexOf('--type')
const typeArg = typeIdx !== -1 ? args[typeIdx + 1] : 'patch'

function exec(cmd, opts = {}) {
  const result = execSync(cmd, { cwd: root, encoding: 'utf8', ...opts })
  return result ? result.trim() : ''
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function writeJson(path, data) {
  writeFileSync(resolve(root, path), JSON.stringify(data, null, 2) + '\n')
}

function bumpVersion(version, type) {
  if (/^\d+\.\d+\.\d+$/.test(type)) {
    return type
  }
  const [ major, minor, patch ] = version.split('.').map(Number)
  if (type === 'major') {
    return `${major + 1}.0.0`
  }
  if (type === 'minor') {
    return `${major}.${minor + 1}.0`
  }
  return `${major}.${minor}.${patch + 1}`
}

// 1. Check on master branch
console.log('Checking branch...')
const branch = exec('git symbolic-ref -q HEAD')
if (!/refs\/heads\/master/.test(branch)) {
  console.error('Error: Branch is not master')
  process.exit(1)
}

// 2. Check clean state
console.log('Checking git status...')
const dirty = exec('git diff-index HEAD --')
if (dirty) {
  console.error('Error: Repository is dirty')
  process.exit(1)
}

// 3. Git pull
console.log('Pulling from origin master...')
exec('git pull origin master', { stdio: 'inherit' })

// 4. Bump version
const pkg = readJson('package.json')
const newVersion = bumpVersion(pkg.version, typeArg)
console.log(`Bumping version: ${pkg.version} → ${newVersion}`)

for (const file of [ 'package.json', 'bower.json', 'component.json' ]) {
  try {
    const json = readJson(file)
    json.version = newVersion
    writeJson(file, json)
  } catch {
    // file may not exist
  }
}

// 5. Update changelog
const year = new Date().getFullYear()
const date = new Date().toISOString().slice(0, 10)
const changelogPath = resolve(root, 'CHANGELOG.md')
let changelog = readFileSync(changelogPath, 'utf8')
const lastDate = /\d{4}-\d{2}-\d{2}/.exec(changelog)?.[0]

if (lastDate) {
  const log = exec(`git log --since="${lastDate} 00:00:00" --oneline --pretty=format:"%s"`)
  if (log) {
    const updates = [
      `### Vegas ${newVersion} ${date}`,
      '',
      '* ' + log.replace(/\n/g, '\n* ')
    ].join('\n')
    changelog = changelog.replace(/(## CHANGE LOG)/, `$1\n\n${updates}`)
    writeFileSync(changelogPath, changelog)
  }
}

const editor = process.env.EDITOR || 'vim'
spawnSync(editor, [ changelogPath, '-n', '+7' ], { stdio: 'inherit' })

// 6. Update copyright year in README
const readmePath = resolve(root, 'README.md')
const readme = readFileSync(readmePath, 'utf8')
writeFileSync(readmePath, readme.replace(/(Copyright )(\d{4})/g, `$1${year}`))

// 7. Build
console.log('Building...')
execSync('node scripts/build.js', { cwd: root, stdio: 'inherit' })

// 8. Git commit, tag, push
console.log('Committing...')
exec('git add -A')
exec(`git commit -m "Build v${newVersion}"`)
exec(`git tag v${newVersion}`)
exec('git push origin master --tags', { stdio: 'inherit' })

// 9. Publish to gh-pages
console.log('Publishing to gh-pages...')
const tmpDir = resolve(root, 'tmp')
rmSync(tmpDir, { recursive: true, force: true })
mkdirSync(tmpDir)

// Copy dist to tmp
exec('cp -r dist/* tmp/')

// Generate metadata
const metadata = {
  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  version: `v${newVersion}`
}
const metaJson = JSON.stringify(metadata, null, 4)
writeFileSync(resolve(tmpDir, 'metadata.json'), metaJson)
writeFileSync(resolve(tmpDir, 'metadata.js'), `__metadata(${metaJson});`)

// Create zip
await new Promise((resolve_zip, reject) => {
  const output = createWriteStream(resolve(tmpDir, 'vegas.zip'))
  const archive = archiver('zip')
  output.on('close', resolve_zip)
  archive.on('error', reject)
  archive.pipe(output)
  archive.glob('**/*', { cwd: resolve(root, 'dist') })
  archive.finalize()
})

// Update gh-pages
exec([
  'git checkout gh-pages',
  `rm -rf releases/${newVersion}`,
  `mkdir -p releases/${newVersion}`,
  `cp -r tmp/* releases/${newVersion}`,
  `git add -A releases/${newVersion}`,
  'rm -rf releases/latest',
  'mkdir -p releases/latest',
  'cp -r tmp/* releases/latest',
  'git add -A releases/latest',
  `git commit -m "Publish release v${newVersion}."`,
  'git push origin gh-pages',
  'git checkout -'
].join(' && '), { stdio: 'inherit' })

// Clean tmp
rmSync(tmpDir, { recursive: true, force: true })

// 10. npm publish
console.log('Publishing to npm...')
execSync('npm publish', { cwd: root, stdio: 'inherit' })

console.log(`\nReleased v${newVersion}!`)
