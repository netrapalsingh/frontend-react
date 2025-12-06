const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const PUBLIC = __dirname;

const server = http.createServer((req, res) => {
  const rawUrl = req.url || '/';
  const relPath = rawUrl === '/' ? 'index.html' : rawUrl.split('?')[0].replace(/^\//, '');
  const filePath = path.join(PUBLIC, relPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type':'text/plain'});
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const map = {
      '.html':'text/html',
      '.js':'application/javascript',
      '.mjs':'application/javascript',
      '.jsx':'application/javascript',
      '.css':'text/css',
      '.json':'application/json',
      '.svg':'image/svg+xml',
      '.png':'image/png',
      '.jpg':'image/jpeg',
      '.jpeg':'image/jpeg',
      '.webp':'image/webp',
      '.ico':'image/x-icon'
    };
    res.writeHead(200, {'Content-Type': map[ext] || 'application/octet-stream'});
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Frontend (React CDN) running on http://localhost:${PORT}`));
