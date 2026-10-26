const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const manifest = JSON.parse(
  fs.readFileSync("scripts/image-manifest.json", "utf8"),
);
fs.mkdirSync("assets/images/editorial", { recursive: true });
function convert(args) {
  const result = spawnSync("magick", args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0)
    throw new Error(result.stderr || "Image conversion failed");
}
for (const item of manifest) {
  const destination = path.join(
    "assets/images",
    item.output || `editorial/${item.name}.webp`,
  );
  if (!fs.existsSync(destination) || item.output?.startsWith("programs/"))
    convert([item.path, "-resize", "1400x", "-quality", "84", destination]);
  for (const width of [480, 960]) {
    const variant = destination.replace(".webp", `-${width}.webp`);
    if (!fs.existsSync(variant))
      convert([destination, "-resize", `${width}x`, "-quality", "82", variant]);
  }
}
console.log(`Imported ${manifest.length} unique images with responsive sizes.`);
