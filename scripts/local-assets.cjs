const fs = require("node:fs");
const path = require("node:path");
fs.mkdirSync("assets/fonts", { recursive: true });
fs.mkdirSync("assets/vendor/bootstrap-icons/fonts", { recursive: true });
for (const family of ["inter", "manrope"]) {
  for (const weight of [400, 500, 600, 700, 800]) {
    const name = `${family}-latin-${weight}-normal.woff2`;
    fs.copyFileSync(
      `node_modules/@fontsource/${family}/files/${name}`,
      `assets/fonts/${name}`,
    );
  }
  fs.copyFileSync(
    `node_modules/@fontsource/${family}/LICENSE`,
    `assets/fonts/${family}-LICENSE.txt`,
  );
}
fs.copyFileSync(
  "node_modules/bootstrap-icons/font/bootstrap-icons.min.css",
  "assets/vendor/bootstrap-icons/bootstrap-icons.min.css",
);
fs.copyFileSync(
  "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2",
  "assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2",
);
fs.copyFileSync(
  "node_modules/bootstrap-icons/LICENSE",
  "assets/vendor/bootstrap-icons/LICENSE.txt",
);
let style = fs.readFileSync("assets/css/style.css", "utf8");
style = style.replace(/^@import[^\n]*\n/m, "");
let faces = "";
for (const family of ["Inter", "Manrope"])
  for (const weight of [400, 500, 600, 700, 800])
    faces += `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('../fonts/${family.toLowerCase()}-latin-${weight}-normal.woff2') format('woff2')}\n`;
if (!style.includes("@font-face")) style = faces + style;
fs.writeFileSync("assets/css/style.css", style);
let build = fs.readFileSync("scripts/build.cjs", "utf8");
if (!build.includes("bootstrap-icons.min.css"))
  build = build.replace(
    '    <link rel="stylesheet" href="${prefix}assets/css/style.css">',
    '    <link rel="stylesheet" href="${prefix}assets/vendor/bootstrap-icons/bootstrap-icons.min.css">\n    <link rel="stylesheet" href="${prefix}assets/css/style.css">',
  );
fs.writeFileSync("scripts/build.cjs", build);
console.log("Fonts and Bootstrap Icons are now hosted locally.");
