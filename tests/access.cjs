const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto("http://127.0.0.1:4173/pages/index.html");
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  assert(await drawer.isVisible());
  assert(
    await page
      .locator("body")
      .evaluate((n) => n.classList.contains("navigation-open")),
  );
  await drawer.getByText("Home", { exact: true }).click();
  assert(await drawer.getByRole("link", { name: "Home Page 2" }).isVisible());
  await drawer.locator(".drawer-settings").scrollIntoViewIfNeeded();
  await drawer.getByRole("button", { name: "Change appearance" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await drawer.locator("[data-action=rtl]").click();
  assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
  await drawer.locator("[data-action=rtl]").click();
  await drawer.getByRole("button", { name: "Change appearance" }).click();
  await drawer.evaluate((n) => (n.scrollTop = 0));
  await page.screenshot({
    path: "tests/screenshots/mobile-navigation-drawer.png",
  });
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator("body")
      .evaluate((n) => n.classList.contains("navigation-open")),
    false,
  );
  assert.equal(await page.locator("#main").evaluate((n) => n.inert), false);
  await page.setViewportSize({ width: 820, height: 1000 });
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.screenshot({
    path: "tests/screenshots/tablet-navigation-drawer.png",
  });
  await drawer
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  for (const route of ["login", "register", "forgot-password"]) {
    await page.goto("http://127.0.0.1:4173/pages/" + route + ".html");
    for (const width of [1440, 1024, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route + " overflow " + width,
      );
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
      path: "tests/screenshots/" + route + "-access.png",
      fullPage: true,
    });
  }
  await page.goto("http://127.0.0.1:4173/pages/register.html");
  assert.equal(await page.locator('.site-header,.site-footer').count(),0);
  assert.equal(await page.locator('.access-story .brand').count(),1);
  await page.locator("input[name=password]").fill("Summer2027!More");
  assert.equal(
    await page.locator("[data-password-strength]").innerText(),
    "Strong mix",
  );
  await page
    .getByRole("button", { name: "Show confirm password", exact: true })
    .click();
  assert.equal(
    await page.locator("input[name=confirm]").getAttribute("type"),
    "text",
  );
  await page.getByLabel("Full name", { exact: true }).fill("Casey Parent");
  await page
    .locator("[data-form=register]")
    .getByLabel("Email address", { exact: true })
    .fill("casey@example.com");
  await page.getByLabel("Phone", { exact: true }).fill("9876543210");
  await page.locator("input[name=confirm]").fill("Summer2027!More");
  await page.locator("input[value=guardian]").check();
  await page
    .locator("select[name=ageGroup]")
    .selectOption({ label: "7–9 years" });
  await page.locator(".auth-consent input").check();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.waitForURL("**/parent/index.html");
  const profile = await page.evaluate(
    () => JSON.parse(localStorage.getItem("campora-demo-v1")).profile,
  );
  assert.equal(profile.relationship, "guardian");
  assert.equal(profile.ageGroup, "7–9 years");
  console.log(
    "Drawer controls, Escape, touch layouts, new account forms, password controls and registration persistence passed.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
