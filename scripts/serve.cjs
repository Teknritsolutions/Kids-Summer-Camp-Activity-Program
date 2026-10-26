const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    let file;
    try {
      file = path.resolve(
        root,
        "." + decodeURIComponent(req.url.split("?")[0]),
      );
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(
        fs.existsSync(path.join(root, "pages", "404.html"))
          ? fs
              .readFileSync(path.join(root, "pages", "404.html"), "utf8")
              .replace("<head>", '<head><base href="/pages/">')
          : "Not found",
      );
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Campora: http://127.0.0.1:4173"),
  );
