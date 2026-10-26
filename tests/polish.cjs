const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://127.0.0.1:4173/pages/index.html");
  const home = page.locator(".nav details").first();
  await home.locator("summary").hover();
  assert((await home.getAttribute("open")) !== null);
  assert(await home.getByRole("link", { name: "Home Page 1" }).isVisible());
  assert(await home.getByRole("link", { name: "Home Page 2" }).isVisible());
  assert(await home.locator("summary.active").count());
  await page.locator("main").hover({ position: { x: 20, y: 20 } });
  assert.equal(await home.getAttribute("open"), null);
  await page.goto("http://127.0.0.1:4173/pages/contact.html");
  assert.equal(
    await page
      .locator(
        "form[data-form=contact] input:not([placeholder]), form[data-form=contact] textarea:not([placeholder])",
      )
      .count(),
    0,
  );
  const underline = await page
    .locator(".nav > a[aria-current=page]")
    .evaluate((el) => getComputedStyle(el, "::before").transform);
  assert.equal(underline, "matrix(1, 0, 0, 1, 0, 0)");
  await page
    .locator("form[data-form=contact]")
    .screenshot({ path: "tests/screenshots/contact-form-polished.png" });
  await page.goto("http://127.0.0.1:4173/pages/home-2.html");
  for (const width of [1440, 1024, 820]) {
    await page.setViewportSize({ width, height: 1000 });
    const buttons = await page
      .getByRole("link", { name: "Explore the week" })
      .evaluateAll((nodes) =>
        nodes.map((el) => el.getBoundingClientRect().top),
      );
    assert(
      Math.abs(buttons[0] - buttons[1]) < 2,
      "Weekly card button alignment " + width,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173/pages/programs.html");
  await page.locator("select[name=age]").click();
  await page.screenshot({ path: "tests/screenshots/dropdown-polished.png" });
  await page.keyboard.press("Escape");
  await page.locator("select[name=age]").selectOption("7-9");
  assert.equal(await page.locator("select[name=age]").inputValue(), "7-9");
  await page.goto("http://127.0.0.1:4173/pages/pricing.html");
  await page.screenshot({
    path: "tests/screenshots/pricing-hero-polished.png",
  });
  await page.goto('http://127.0.0.1:4173/pages/schedule.html');
  await page.screenshot({path:'tests/screenshots/schedule-panorama.png'});
  await browser.close();
  console.log(
    "Hover dropdown, active underline, placeholders, card alignment and dropdown selection passed.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
