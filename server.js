const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5500;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/login") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (req.url === "/home") {
    fs.readFile(path.join(__dirname, "dashboard.html"), (err, data) => {
      res.writeHead(200, { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      });
      res.end(data);
    });
  } else if (req.url === "/grafico-de-progresso") {
    fs.readFile(path.join(__dirname, "progress-graph.html"), (err, data) => {
      res.writeHead(200, { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate" 
      });
      res.end(data);
    });
  } else if (req.url.startsWith("/assets/")) {
      const filePath = path.join(__dirname, req.url);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Arquivo não encontrado");
        } else {
          // Detecta tipo de arquivo
          let contentType = "text/plain";
          if (req.url.endsWith(".js")) contentType = "application/javascript";
          if (req.url.endsWith(".css")) contentType = "text/css";
          if (req.url.endsWith(".html")) contentType = "text/html";
          if (req.url.endsWith(".png")) contentType = "image/png";
          if (req.url.endsWith(".jpg") || req.url.endsWith(".jpeg")) contentType = "image/jpeg";

          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>404 - Página não encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});