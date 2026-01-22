const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const baseDir = path.join(__dirname, 'frontend');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(baseDir, reqPath);

    if (!filePath.startsWith(baseDir)) {
      send404(res);
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        send404(res);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.statusCode = 200;
      res.setHeader('Content-Type', type);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Serving ${baseDir} at http://localhost:${port}`);
});

process.on('SIGINT', () => process.exit());
