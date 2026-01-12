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
copyIfExists(path.join('abrir', 'index.html'))

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

function ensurePwaHooks(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    console.warn(`Skip (not found): ${htmlPath}`)
    return
  }
  let html = fs.readFileSync(htmlPath, 'utf8')
  if (!html.includes('rel="manifest"')) {
    html = html.replace(
      /<\/head>/i,
      `  <link rel="manifest" href="/manifest.json">\n  <meta name="theme-color" content="#FFD700">\n</head>`
    )
  }
  if (!html.includes("serviceWorker.register('/sw.js')")) {
    html = html.replace(
      /<\/body>/i,
      `  <script>\n    if ('serviceWorker' in navigator) {\n      window.addEventListener('load', () => {\n        navigator.serviceWorker.register('/sw.js').catch(() => {});\n      });\n      navigator.serviceWorker.addEventListener('controllerchange', () => {\n        if (sessionStorage.getItem('sw-reloaded')) return;\n        sessionStorage.setItem('sw-reloaded', '1');\n        window.location.reload();\n      });\n    }\n  </script>\n</body>`
    )
  }
  html = html.replace(/\\n\s*/g, '')
  fs.writeFileSync(htmlPath, html)
  console.log(`Ensured manifest + SW registration in ${htmlPath}`)
}

ensurePwaHooks(path.join(process.cwd(), 'dist', 'index.html'))

console.log('Public assets copied to dist/')


