// Serveur statique pour mesurer le site NAS MODE en local.
// Sert public/ sur http://localhost:4321 ; "/" -> nasmode.html
// Usage : node .claude/skills/nas-mobile-blocks/scripts/serve.js
const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../../../public')
const port = Number(process.env.PORT) || 4321

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0])
    if (urlPath === '/') urlPath = '/nasmode.html'

    // Empêche de sortir de public/ via ../
    let file = path.normalize(path.join(root, urlPath))
    if (!file.startsWith(root)) {
      res.writeHead(403)
      return res.end('403')
    }

    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    } catch {
      /* laisse readFile renvoyer le 404 */
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        return res.end('404 ' + urlPath)
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
        // Pas de cache : chaque mesure doit repartir d'un chargement à froid.
        'Cache-Control': 'no-store',
      })
      res.end(data)
    })
  })
  .listen(port, () => console.log('NAS MODE static server on http://localhost:' + port))
