const { chromium } = require("playwright");
const fs = require("node:fs");
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
  let checks = 0;
  for (const route of routes) {
    console.log("Appearance: " + route);
    await page.goto("http://127.0.0.1:4173/pages/" + route);
    for (const width of [1440, 1280, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route + " overflow " + width,
      );
      for (const action of ["theme", "rtl"]) {
        const button = page.locator('[data-action="' + action + '"]').first();
        if (!(await button.count())) continue;
        assert(await button.isVisible(), route + " missing " + action);
        const b = await button.boundingBox();
        assert(
          b.x >= 0 && b.x + b.width <= width + 1,
          route + " clipped " + action,
        );
      }
      checks++;
    }
    const theme = page.locator('[data-action="theme"]').first();
    if (await theme.count()) {
      await theme.click();
      const dark = await page.evaluate(
        () => document.documentElement.dataset.theme === "dark",
      );
      assert(
        await theme.locator(".bi-" + (dark ? "sun" : "moon-stars")).count(),
      );
      const direction = page.locator(".direction-toggle");
      await direction.click();
      const rtl = await page.evaluate(
        () => document.documentElement.dir === "rtl",
      );
      assert.equal(
        await direction.locator("span").textContent(),
        rtl ? "LTR" : "RTL",
      );
      await page.reload();
      assert.equal(
        await page.evaluate(() => document.documentElement.dir),
        rtl ? "rtl" : "ltr",
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.theme),
        dark ? "dark" : "light",
      );
    }
    assert(!/stackly/i.test(await page.locator("body").innerText()));
    const footer = page.locator(".site-footer");
    if (await footer.count()) {
      assert.equal(await footer.locator('[data-action="rtl"]').count(), 0);
      assert(
        !/Documentation|illustrative template/i.test(await footer.innerText()),
      );
      const menu = page
        .locator(".nav details")
        .filter({ has: page.locator("summary", { hasText: "Dashboard" }) });
      assert.equal(await menu.locator("a").count(), 2);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173/pages/index.html");
  await page.evaluate(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.dataset.theme = "light";
  });
  await page
    .locator(".site-footer")
    .screenshot({ path: "tests/screenshots/footer-refined.png" });
  console.log(
    "Appearance controls, persistence, dashboard menus, footer and " +
      checks +
      " viewport checks passed.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
