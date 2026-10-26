const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const files = [
  ...fs
    .readdirSync(path.join(root, "pages"))
    .filter((f) => f.endsWith(".html")),
  ...["parent", "admin"].flatMap((d) =>
    fs
      .readdirSync(path.join(root, "pages", d))
      .filter((f) => f.endsWith(".html"))
      .map((f) => d + "/" + f),
  ),
];
const widths = [320, 420, 768, 1024, 1440];
const extra = [360, 375, 390, 576, 820, 1280, 1920];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.route("**/fonts.googleapis.com/**", (r) => r.abort());
  await context.route("**/fonts.gstatic.com/**", (r) => r.abort());
  const page = await context.newPage();
  const errors = [];
  const results = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const base = "http://127.0.0.1:4173/pages/";
  for (const file of files) {
    for (const theme of ["light", "dark"]) {
      await page.addInitScript(
        (theme) => localStorage.setItem("campora-theme", theme),
        theme,
      );
      const actual =
        file === "program-details.html"
          ? file + "?id=arts"
          : file === "blog-details.html"
            ? file + "?id=first-day"
            : file;
      await page.goto(base + actual, { waitUntil: "load" });
      await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(async () => {
          await Promise.all(
            [...document.images].map((image) => image.decode().catch(() => {})),
          );
        });
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images]
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
          h1: document.querySelectorAll("h1").length,
          sections: document.querySelectorAll("main>section").length,
        }));
        results.push({ file, theme, width, ...result });
      }
    }
    console.log("Checked " + file);
  }
  for (const file of [
    "index.html",
    "programs.html",
    "parent/index.html",
    "admin/index.html",
  ]) {
    await page.goto(base + file);
    for (const width of extra) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      results.push({ file, width, theme: "dark", overflow });
    }
  }
  // Complete functional journey and shared-record verification.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "login.html");
  await page.getByRole("button", { name: "Try parent demo" }).click();
  await page.waitForURL("**/parent/index.html");
  await page.goto(base + "parent/children.html");
  await page.getByRole("button", { name: "Add child", exact: true }).click();
  await page.getByLabel("Child name").fill("Casey Demo");
  await page.getByLabel("Age", { exact: true }).fill("10");
  await page.getByLabel("Preferred activities").fill("Sports and coding");
  await page.getByRole("button", { name: "Save demo changes" }).click();
  assert(await page.getByRole("heading", { name: "Casey Demo" }).count());
  await page.goto(base + "programs.html");
  await page.getByLabel("Activity", { exact: true }).selectOption("Coding");
  await page.getByLabel("Age group", { exact: true }).selectOption("10-12");
  assert.equal(await page.locator(".program-card").count(), 1);
  await page
    .getByRole("link", { name: "Details", exact: false })
    .first()
    .click();
  await page.waitForLoadState("load");
  assert.match(await page.title(), /Robots/);
  await page.getByRole("link", { name: "Begin demo enrollment" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("[name=wizard-child][value^=c]").last().check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-date").selectOption("2027-06-07");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-session").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-accept").check();
  await page.getByRole("button", { name: "Confirm demo enrollment" }).click();
  assert(
    await page
      .getByRole("heading", { name: "A little adventure is on the calendar." })
      .count(),
  );
  await page.goto(base + "parent/payments.html");
  await page
    .getByRole("button", { name: "Simulate payment", exact: true })
    .last()
    .click();
  await page
    .getByRole("button", { name: "Simulate successful payment" })
    .click();
  await page.goto(base + "parent/receipts.html");
  await page.getByRole("link", { name: "View receipt" }).last().click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  assert.equal(
    fs.readFileSync(downloadPath).subarray(0, 5).toString(),
    "%PDF-",
  );
  await page.goto(base + "admin/enrollments.html");
  await page.locator("[data-status]").last().selectOption("Confirmed");
  await page.goto(base + "parent/enrollments.html");
  assert(
    await page
      .locator("tr")
      .last()
      .getByText("Confirmed", { exact: true })
      .count(),
  );
  // Duplicate and age restrictions.
  await page.goto(base + "parent/programs.html?enroll=coding");
  await page.getByRole("button", { name: "Continue" }).click();
  assert((await page.locator("[name=wizard-child][disabled]").count()) >= 1);
  await page.locator("[name=wizard-child]:not(:disabled)").last().check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-date").selectOption("2027-06-07");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-session").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#wizard-accept").check();
  await page.getByRole("button", { name: "Confirm demo enrollment" }).click();
  assert(
    await page
      .getByRole("alert")
      .getByText(/already enrolled/)
      .count(),
  );
  await page.keyboard.press("Escape");
  await page.goto(base + "contact.html");
  await page.getByLabel("Your name").fill("Demo Enquirer");
  await page
    .getByLabel("Email address", { exact: true })
    .first()
    .fill("demo@example.com");
  await page.getByLabel("Subject").fill("Sample enquiry");
  await page.getByLabel("Your message").fill("A fictional test enquiry.");
  await page.getByRole("button", { name: "Save demo enquiry" }).click();
  await page.goto(base + "admin/messages.html");
  assert(await page.getByRole("heading", { name: "Sample enquiry" }).count());
  // Themes, RTL and representative screenshots.
  fs.mkdirSync(path.join(root, "tests/screenshots"), { recursive: true });
  for (const [file, width, theme, dir] of [
    ["index.html", 1440, "light", "ltr"],
    ["index.html", 390, "light", "ltr"],
    ["programs.html", 1440, "dark", "ltr"],
    ["parent/index.html", 1440, "light", "ltr"],
    ["admin/index.html", 390, "dark", "ltr"],
    ["contact.html", 390, "dark", "rtl"],
    ["parent/index.html", 768, "dark", "rtl"],
    ["home-2.html", 1440, "light", "ltr"],
  ]) {
    await page.goto(base + file);
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(
      async ([theme, dir]) => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dir = dir;
        Campora.drawCharts?.();
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      },
      [theme, dir],
    );
    await page.screenshot({
      path: path.join(
        root,
        `tests/screenshots/${file.replaceAll("/", "-").replace(".html", "")}-${width}-${theme}-${dir}.png`,
      ),
      fullPage: true,
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    results.push({ file, width, theme, dir, overflow });
  }
  const failures = results.filter(
    (r) =>
      r.overflow ||
      r.broken?.length ||
      (r.h1 !== undefined && r.h1 !== 1) ||
      ((r.file === "index.html" || r.file === "home-2.html") &&
        r.sections !== undefined &&
        r.sections !== 10) ||
      ([
        "about.html",
        "programs.html",
        "program-details.html",
        "age-groups.html",
        "schedule.html",
        "safety.html",
        "pricing.html",
        "blog.html",
        "blog-details.html",
        "contact.html",
      ].includes(r.file) &&
        r.sections !== undefined &&
        r.sections !== 6),
  );
  fs.writeFileSync(
    path.join(root, "tests/results.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        pages: files.length,
        checks: results.length,
        errors,
        failures,
        functionalJourney: "passed",
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      pages: files.length,
      checks: results.length,
      errors,
      failures: failures.length,
      functionalJourney: "passed",
    }),
  );
  await browser.close();
  assert.equal(errors.length, 0);
  assert.equal(failures.length, 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
