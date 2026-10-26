const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const source =
  "C:/Users/Dell/.codex/generated_images/01a15ea2-0db4-71d1-b7f2-75a04789cff2/exec-a9dd7f88-d1cf-40de-9a89-18ad6afa3787.png";
const names = [
  "story",
  "programs",
  "ages",
  "schedule",
  "safety",
  "families",
  "journal",
  "contact",
  "trail",
];
fs.mkdirSync("assets/images/heroes", { recursive: true });
function convert(args) {
  const r = spawnSync("magick", args, { encoding: "utf8", windowsHide: true });
  if (r.status !== 0) throw Error(r.stderr);
}
names.forEach((name, i) => {
  const left = (i % 3) * 512,
    top = Math.round((Math.floor(i / 3) * 1024) / 3);
  const bottom = Math.round(((Math.floor(i / 3) + 1) * 1024) / 3);
  const out = "assets/images/heroes/" + name + ".webp";
  convert([
    source,
    "-crop",
    `504x${bottom - top - 8}+${left + 4}+${top + 4}`,
    "+repage",
    "-quality",
    "88",
    out,
  ]);
  for (const width of [480, 960])
    convert([
      out,
      "-resize",
      width + "x",
      "-quality",
      "84",
      out.replace(".webp", "-" + width + ".webp"),
    ]);
});
let main = fs.readFileSync("assets/js/main.js", "utf8");
main = main.replace(
  '<section class="center-page"><span class="big-number">404</span>',
  '<section class="center-page">${image("heroes/trail.webp", "A woodland trail leading back to camp", "utility-hero-image", true)}<span class="big-number">404</span>',
);
main = main.replace(
  '<section class="center-page"><span class="eyebrow">Something good is growing</span>',
  '<section class="center-page">${image("heroes/trail.webp", "A sunny camp cabin ready for the next adventure", "utility-hero-image", true)}<span class="eyebrow">Something good is growing</span>',
);
fs.writeFileSync("assets/js/main.js", main);
console.log("Prepared nine new page hero photos.");
