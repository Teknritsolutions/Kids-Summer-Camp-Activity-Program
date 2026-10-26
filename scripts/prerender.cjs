/* Public pages retain meaningful HTML before JavaScript enhances the demo. */
const fs = require("node:fs");
const vm = require("node:vm");
const publicFiles = fs
  .readdirSync("pages")
  .filter((file) => file.endsWith(".html"));
for (const file of publicFiles) {
  const page = file.replace(".html", "");
  let markup = "";
  const sandbox = {
    console,
    URLSearchParams,
    Intl,
    Date,
    structuredClone,
    location: {
      pathname: "/pages/" + file,
      search:
        page === "program-details"
          ? "?id=arts"
          : page === "blog-details"
            ? "?id=first-day"
            : "",
    },
    localStorage: { getItem: () => null },
    sessionStorage: { getItem: () => null },
    document: {
      body: { dataset: { page } },
      getElementById: () => ({
        set innerHTML(value) {
          markup = value;
        },
      }),
      querySelector: () => ({ setAttribute() {} }),
    },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync("assets/js/data.js", "utf8"), sandbox);
  vm.runInContext(fs.readFileSync("assets/js/main.js", "utf8"), sandbox);
  markup = markup.replace(
    /(<div id="program-results"[^>]*>)(<\/div>)/,
    (_, start, end) =>
      start +
      sandbox.Campora.state.programs
        .map((p) => sandbox.Campora.programCard(p))
        .join("") +
      end,
  );
  markup = markup.replace(
    /(<div id="blog-results"[^>]*>)(<\/div>)/,
    (_, start, end) =>
      start +
      sandbox.Campora.state.posts
        .slice(0, 3)
        .map(sandbox.Campora.postCard)
        .join("") +
      end,
  );
  let html = fs.readFileSync("pages/" + file, "utf8");
  const start = html.indexOf('<div id="app">');
  const end = html.search(/<noscript\b/);
  if (start < 0 || end < 0) throw new Error("Missing page shell " + file);
  html =
    html.slice(0, start) +
    '<div id="app">\n' +
    markup.replaceAll("><", ">\n<") +
    "\n</div>\n    " +
    html.slice(end);
  if (sandbox.document.title)
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${sandbox.Campora.escape(sandbox.document.title)}</title>`,
    );
  fs.writeFileSync("pages/" + file, html);
}
console.log("Pre-rendered all public pages with fictional seed content.");
