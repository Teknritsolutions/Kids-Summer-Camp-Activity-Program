const { chromium } = require("playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const base = "http://127.0.0.1:4173/pages/";
  const routes = [
    ...fs
      .readdirSync("pages")
      .filter(
        (f) =>
          f.endsWith(".html") &&
          f !== "program-details.html",
      ),
    ...["sports", "arts", "coding", "swimming", "nature"].map(
      (id) => "program-details.html?id=" + id,
    ),
    "parent/programs.html",
    "../documentation/index.html",
  ];
  const seen = new Map(),
    duplicates = [],
    broken = [],
    links = new Set(),
    titles = [];
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    if (route === "blog.html")
      await page.getByRole("button", { name: "Load more stories" }).click();
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    });
    const images = await page.locator("img").evaluateAll((images) =>
      images.map((i) => ({
        src: i.src,
        ok: i.complete && i.naturalWidth > 0,
      })),
    );
    for (const image of images) {
      if (!image.ok) broken.push({ route, ...image });
      if (image.src.includes("/branding/")) continue;
      if (seen.has(image.src))
        duplicates.push({
          src: image.src,
          first: seen.get(image.src),
          second: route,
        });
      else seen.set(image.src, route);
    }
    for (const link of await page
      .locator("a[href]")
      .evaluateAll((nodes) => nodes.map((a) => a.href)))
      if (link.startsWith(new URL(base).origin) && !link.includes("#"))
        links.add(link);
    titles.push({ route, title: await page.title() });
  }
  const badLinks = [];
  for (const link of links) {
    const response = await page.request.get(link);
    if (response.status() !== 200)
      badLinks.push({ link, status: response.status() });
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  await staticPage.goto(base + "index.html");
  assert.equal(await staticPage.locator("main>section").count(), 10);
  assert.equal(await staticPage.locator("h1").count(), 1);
  await staticPage.goto(base + "programs.html");
  assert.equal(await staticPage.locator(".program-card").count(), 5);
  const result = {
    date: new Date().toISOString(),
    routes: routes.length,
    editorialImages: seen.size,
    links: links.size,
    duplicates,
    broken,
    badLinks,
    staticPublicContent: "passed",
    titles,
  };
  fs.writeFileSync("tests/asset-results.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, titles: undefined }));
  await browser.close();
  assert.equal(duplicates.length, 0);
  assert.equal(broken.length, 0);
  assert.equal(badLinks.length, 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
