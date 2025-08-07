const fs = require('fs')
const path = require('path')

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
  console.log(`Copied ${src} -> ${dest}`)
}

function copyIfExists(relPath) {
  const src = path.join(process.cwd(), 'public', relPath)
  const dest = path.join(process.cwd(), 'dist', relPath)
  if (fs.existsSync(src)) {
    copyFile(src, dest)
  } else {
    console.warn(`Skip (not found): public/${relPath}`)
  }
}

// Core files
copyIfExists('landing.html')
copyIfExists('manifest.json')
copyIfExists('sw.js')

// Icons (both svg and png variants if present)
copyIfExists('icon-192.png')
copyIfExists('icon-512.png')
copyIfExists('icon-192.svg')
copyIfExists('icon-512.svg')

// Copy any additional files under public/icons directory if exists
const iconsDir = path.join(process.cwd(), 'public', 'icons')
if (fs.existsSync(iconsDir)) {
  const files = fs.readdirSync(iconsDir)
  for (const file of files) {
    copyIfExists(path.join('icons', file))
  }
}

console.log('Public assets copied to dist/')


