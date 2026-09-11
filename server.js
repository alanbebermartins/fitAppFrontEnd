const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5500;

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/" || pathname === "/login") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (pathname === "/home" || pathname === "/home/") {
    fs.readFile(path.join(__dirname, "dashboard.html"), (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      });
      res.end(data);
    });
  } else if (pathname === "/grafico-de-progresso" || pathname === "/grafico-de-progresso/") {
    fs.readFile(path.join(__dirname, "progress-graph.html"), (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      });
      res.end(data);
    });
  } else if (pathname.startsWith("/assets/")) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Arquivo não encontrado");
      } else {
        let contentType = "text/plain";
        if (pathname.endsWith(".js")) contentType = "application/javascript";
        if (pathname.endsWith(".css")) contentType = "text/css";
        if (pathname.endsWith(".html")) contentType = "text/html";
        if (pathname.endsWith(".png")) contentType = "image/png";
        if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) contentType = "image/jpeg";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>404 - Página não encontrada</h1>");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});