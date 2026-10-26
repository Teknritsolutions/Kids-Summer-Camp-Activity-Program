const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const routes = fs.readdirSync("pages").filter((f) => f.endsWith(".html"));
  const failures = [];
  for (const route of routes) {
    await page.goto("http://127.0.0.1:4173/pages/" + route);
    for (const width of [1920, 1440, 1280, 1024, 992, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready);
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )
      )
        failures.push(route + " overflow " + width);
      if (width >= 992 && !['login.html','register.html','404.html','coming-soon.html'].includes(route)) {
        if (await page.locator(".site-header .menu-toggle").isVisible())
          failures.push(route + " desktop toggle " + width);
        if (!(await page.locator(".site-header .nav").isVisible()))
          failures.push(route + " desktop nav hidden " + width);
        const overlap = await page.evaluate(() => {
          const nav = document
              .querySelector(".site-header .nav")
              .getBoundingClientRect(),
            actions = document
              .querySelector(".site-header .header-actions")
              .getBoundingClientRect(),
            brand = document
              .querySelector(".site-header .brand")
              .getBoundingClientRect();
          return nav.right > actions.left - 4 || nav.left < brand.right + 4;
        });
        if (overlap) failures.push(route + " header overlaps " + width);
      }
    }
    await page.locator("main img").evaluateAll((nodes) =>
      Promise.all(
        nodes.map((n) => {
          n.loading = "eager";
          return n.decode().catch(() => {});
        }),
      ),
    );
    const imgs = await page
      .locator("main img")
      .evaluateAll((nodes) =>
        nodes.filter((n) => !n.complete || !n.naturalWidth).map((n) => n.src),
      );
    if (imgs.length) failures.push(route + " broken images " + imgs.join(","));
    assert(await page.locator("main img").count(), route + " needs hero image");
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173/pages/about.html");
  await page.screenshot({ path: "tests/screenshots/about-image-hero.png" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({
    path: "tests/screenshots/about-image-hero-mobile.png",
  });
  console.log(
    JSON.stringify({
      pages: routes.length,
      viewportChecks: routes.length * 8,
      failures,
    }),
  );
  await browser.close();
  assert.equal(failures.length, 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
