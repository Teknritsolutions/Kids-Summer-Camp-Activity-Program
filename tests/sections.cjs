const fs = require("node:fs");
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const routes = fs
    .readdirSync("pages")
    .filter((f) => f.endsWith(".html"))
    .concat(
      ...["admin", "parent"].map((dir) =>
        fs
          .readdirSync("pages/" + dir)
          .filter((f) => f.endsWith(".html"))
          .map((f) => dir + "/" + f),
      ),
    );
  const seen = new Map(),
    duplicates = [];
  for (const route of routes) {
    await page.goto("http://127.0.0.1:4173/pages/" + route);
    const sections = await page
      .locator("main > section")
      .evaluateAll((nodes) =>
        nodes.map((n) => ({
          heading: n.querySelector("h2,h1")?.textContent,
          text: n.innerText.replace(/\s+/g, " ").trim(),
        })),
      );
    for (const section of sections) {
      if (section.text.length < 80) continue;
      if (seen.has(section.text))
        duplicates.push({
          first: seen.get(section.text),
          second: route,
          heading: section.heading,
        });
      else seen.set(section.text, route);
    }
  }
  console.log(
    JSON.stringify({
      pages: routes.length,
      uniqueContentSections: seen.size,
      duplicateSections: duplicates,
    }),
  );
  await browser.close();
  assert.equal(duplicates.length, 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
