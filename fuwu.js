const http = require('http');

function handleGetRequest(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('This is a GET request');
  res.end();
}

function handlePostRequest(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`This is a POST request with body: ${body}`);
    res.end();
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/api/data') {
      handleGetRequest(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      res.end();
    }
  } else if (req.method === 'POST') {
    if (req.url === '/') {
      handlePostRequest(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      res.end();
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.write('Method Not Allowed');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
