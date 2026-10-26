const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const base = "http://127.0.0.1:4173/pages/";
  const checks = [];
  const done = (name) => {
    checks.push(name);
    console.log("Passed: " + name);
  };
  await page.goto(base + "programs.html");
  await page
    .getByLabel("Find their next favorite thing")
    .fill("no such adventure");
  assert.equal(await page.locator(".program-card").count(), 0);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".program-card").length === 5,
  );
  await page.getByLabel("Weekly budget").selectOption("200");
  assert.equal(await page.locator(".program-card").count(), 2);
  done("Program empty state, reset, and budget filter");
  await page.goto(base + "blog.html");
  await page.getByLabel("Category", { exact: true }).selectOption("Safety");
  assert.equal(await page.locator("#blog-results article").count(), 1);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll("#blog-results article").length === 3,
  );
  await page.getByRole("button", { name: "Load more stories" }).click();
  assert.equal(await page.locator("#blog-results article").count(), 6);
  done("Journal category search and load more");
  await page.goto(base + "schedule.html");
  const all = page.getByRole("tab", { name: "All", exact: true });
  await all.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("tab", { name: "Monday" })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.equal(await page.locator(".schedule-day").count(), 1);
  await page.getByRole("button", { name: "Next sample week" }).click();
  assert.match(await page.locator("#schedule-week").innerText(), /14/);
  done("Schedule keyboard tabs and week navigation");
  await page.goto(base + "register.html");
  await page.getByLabel("Full name").fill("Jordan Demo");
  await page
    .getByLabel("Email address", { exact: true })
    .first()
    .fill("jordan@example.com");
  await page.getByLabel("Phone", { exact: true }).fill("555-0199");
  await page.getByLabel("Password", { exact: true }).fill("samplepass");
  await page.getByLabel("Confirm password", { exact: true }).fill("mismatched");
  await page.locator("[data-form=register] input[type=checkbox]").check();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  assert.match(
    await page.locator("[data-form=register] .form-feedback").innerText(),
    /do not match/,
  );
  await page.getByLabel("Confirm password", { exact: true }).fill("samplepass");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.waitForURL("**/parent/index.html");
  assert.match(await page.locator(".dash-heading").innerText(), /Jordan/);
  done("Registration mismatch validation and local profile creation");
  await page.goto(base + "parent/notifications.html");
  await page
    .getByRole("button", { name: "Mark read", exact: true })
    .first()
    .click();
  assert(
    await page
      .getByRole("button", { name: "Mark unread", exact: true })
      .count(),
  );
  done("Notification read state");
  await page.goto(base + "admin/programs.html");
  await page.getByRole("button", { name: "Add program", exact: true }).click();
  await page.getByLabel("Program name").fill("Demo Test Adventure");
  await page.getByLabel("Weekly fee (USD)").fill("199");
  await page
    .getByLabel("Description", { exact: true })
    .fill("A fictional program for a meaningful CRUD test.");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  const row = page.getByRole("row").filter({ hasText: "Demo Test Adventure" });
  assert(await row.count());
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Weekly fee (USD)").fill("209");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  await page.goto(base + "programs.html");
  await page
    .getByLabel("Find their next favorite thing")
    .fill("Demo Test Adventure");
  assert.match(await page.locator(".program-card").innerText(), /209/);
  await page.goto(base + "admin/programs.html");
  await page
    .getByRole("row")
    .filter({ hasText: "Demo Test Adventure" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await page.getByRole("button", { name: "Delete demo program" }).click();
  assert.equal(
    await page
      .getByRole("row")
      .filter({ hasText: "Demo Test Adventure" })
      .count(),
    0,
  );
  done("Admin program add/edit/delete reflected in public catalog");
  await page.goto(base + "admin/sessions.html");
  await page
    .getByRole("row")
    .filter({ hasText: "Little Makers Studio" })
    .first()
    .getByRole("button", { name: "Edit" })
    .click();
  await page.getByLabel("Week starting (Monday)").fill("2027-06-08");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  assert.match(
    await page.locator(".modal-panel .form-feedback").innerText(),
    /Monday/,
  );
  await page.keyboard.press("Escape");
  done("Session date validation");
  await page.goto(base + "admin/messages.html");
  await page.getByRole("button", { name: "Save draft reply" }).first().click();
  await page
    .getByLabel("Draft reply")
    .fill("A fictional local reply. Nothing is sent.");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  assert(
    await page
      .getByText("A fictional local reply. Nothing is sent.", { exact: false })
      .count(),
  );
  done("Local inbox draft reply");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "index.html");
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.locator("#public-nav summary").first().click();
  assert(
    await page
      .getByRole("link", { name: "Home Page 2", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded"),
    "false",
  );
  done("Mobile navigation, nested Home menu, and Escape");
  await page.getByRole("button", { name: "Switch color theme" }).click();
  const theme = await page.locator("html").getAttribute("data-theme");
  await page.goto(base + "parent/index.html");
  assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
  await page
    .getByRole("button", { name: "Toggle dashboard navigation" })
    .click();
  assert(await page.locator(".sidebar").isVisible());
  await page.keyboard.press("Escape");
  assert(!(await page.locator(".sidebar").isVisible()));
  done("Theme persistence and mobile dashboard drawer");
  await page.getByLabel("Open profile menu").click();
  await page
    .locator(".profile-menu")
    .getByRole("link", { name: "Profile & settings" })
    .click();
  await page.waitForURL("**/parent/settings.html");
  done("Profile menu navigation");
  await page.goto(base + "parent/settings.html");
  await page
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  await page.waitForLoadState("load");
  assert.equal(await page.getByLabel("Full name").inputValue(), "Alex Morgan");
  done("Reset restores initial fictional data");
  fs.writeFileSync(
    "tests/interaction-results.json",
    JSON.stringify(
      { date: new Date().toISOString(), checks, status: "passed" },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
