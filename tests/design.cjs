const { chromium } = require("playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const files = [
  ...fs.readdirSync("pages").filter((f) => f.endsWith(".html")),
  ...["parent", "admin"].flatMap((folder) =>
    fs
      .readdirSync("pages/" + folder)
      .filter((f) => f.endsWith(".html"))
      .map((f) => folder + "/" + f),
  ),
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const failures = [],
    checks = [];
  for (const file of files) {
    await page.goto("http://127.0.0.1:4173/pages/" + file, {
      waitUntil: "load",
    });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const mismatches = await page.locator("p").evaluateAll((nodes) =>
        nodes
          .filter(
            (node) =>
              node.textContent.trim() && node.getBoundingClientRect().width > 0,
          )
          .map((node) => ({
            text: node.textContent.trim().slice(0, 65),
            size: getComputedStyle(node).fontSize,
            lineHeight: getComputedStyle(node).lineHeight,
          }))
          .filter((item) => item.size !== "16px" || item.lineHeight !== "28px"),
      );
      if (mismatches.length) failures.push({ file, width, mismatches });
      checks.push({ file, width });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173/pages/index.html");
  const alignment = await page
    .locator(".highlight p")
    .evaluateAll((nodes) =>
      nodes.map((n) => Math.round(n.getBoundingClientRect().top)),
    );
  assert.equal(
    new Set(alignment).size,
    1,
    "All four highlight paragraphs must start at the same height",
  );
  const button = page.locator(".adventure-hero .btn-primary");
  await button.hover();
  await page.waitForTimeout(300);
  const hover = await button.evaluate((node) => ({
    transform: getComputedStyle(node).transform,
    icon: !!node.querySelector(".bi-arrow-right"),
  }));
  assert.notEqual(hover.transform, "none");
  assert(hover.icon);
  await page.setViewportSize({ width: 390, height: 1000 });
  assert.match(
    await page.locator(".adventure-hero h1").innerText(),
    /summer\.\s+A world/,
  );
  await page.goto("http://127.0.0.1:4173/pages/programs.html");
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert(
    await page
      .locator(".section--categories")
      .evaluate((node) => node.getBoundingClientRect().height < 120),
  );
  fs.mkdirSync("tests/screenshots/redesign", { recursive: true });
  const screenshots = [
    ["index.html", 1440, "light"],
    ["index.html", 390, "light"],
    ["index.html", 1440, "dark"],
    ["programs.html", 1440, "light"],
    ["pricing.html", 1440, "light"],
    ["age-groups.html", 1440, "light"],
    ["schedule.html", 390, "dark"],
    ["parent/index.html", 1440, "light"],
  ];
  for (const [file, width, theme] of screenshots) {
    await page.goto("http://127.0.0.1:4173/pages/" + file);
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async (theme) => {
      document.documentElement.dataset.theme = theme;
      Campora.drawCharts?.();
      document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    }, theme);
    await page.screenshot({
      path:
        "tests/screenshots/redesign/" +
        file.replace("/", "-").replace(".html", "") +
        "-" +
        width +
        "-" +
        theme +
        ".png",
      fullPage: true,
    });
  }
  const result = {
    date: new Date().toISOString(),
    paragraphChecks: checks.length,
    paragraphSize: "16px",
    paragraphLineHeight: "28px",
    highlightAlignment: alignment,
    buttonHover: "passed",
    failures,
  };
  fs.writeFileSync(
    "tests/design-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result));
  await browser.close();
  assert.equal(failures.length, 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
