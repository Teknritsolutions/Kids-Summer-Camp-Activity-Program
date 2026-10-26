const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://127.0.0.1:4173/pages/home-2.html");
  assert.equal(await page.locator(".scenic-activity__photo").count(), 6);
  await page.getByRole("button", { name: "Show woodland camp photo" }).click();
  assert.equal(
    await page.locator('[data-hero-scene="1"]').getAttribute("aria-hidden"),
    "false",
  );
  await page
    .getByRole("button", { name: "Show lakeside hiking photo" })
    .click();
  await page.waitForTimeout(700);
  await page.screenshot({
    path: "tests/screenshots/home2-background-hero.png",
  });
  await page
    .locator(".scenic-activity")
    .first()
    .screenshot({ path: "tests/screenshots/activity-background.png" });
  for (const route of ["home-2.html", "contact.html"]) {
    await page.goto("http://127.0.0.1:4173/pages/" + route);
    for (const width of [1440, 1024, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route + " overflow " + width,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator(".contact-panel")
    .screenshot({ path: "tests/screenshots/contact-panel-photo.png" });
  await page.goto('http://127.0.0.1:4173/pages/index.html');
  assert.equal(await page.locator('.testimonial-avatar').count(), 3);
  await page.locator('.testimonial-avatar').evaluateAll(nodes => Promise.all(nodes.map(n => { n.loading='eager'; return n.decode(); })));
  await page.locator('.grid').filter({has: page.locator('.testimonial-avatar')}).screenshot({path:'tests/screenshots/testimonial-portraits.png'});
  await browser.close();
  console.log(
    "Hero controls, six activity backgrounds, three testimonial portraits and responsive layouts passed.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
