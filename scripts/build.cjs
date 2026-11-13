/* Generate readable multipage HTML shells with shared progressive client behavior. */
const fs = require("node:fs");
const path = require("node:path");
const pages = {
  index: [
    "A little adventure. A whole lot of growing up.",
    "Discover Campora’s illustrative summer camp programs for ages 4–16.",
  ],
  "home-2": [
    "More moments worth remembering.",
    "An alternative adventure-led summer camp homepage.",
  ],
  about: [
    "Our story",
    "Discover the philosophy, values, and demo team behind Campora.",
  ],
  programs: [
    "Find their kind of adventure",
    "Search sample camp programs by activity, age, price, and date.",
  ],
  "program-details": [
    "Your next camp adventure",
    "Explore program outcomes, sample dates, and enrollment options.",
  ],
  "age-groups": [
    "A place to grow at every age",
    "Explore activities for ages 4–6, 7–9, 10–12, and 13–16.",
  ],
  schedule: [
    "A week full of possibility",
    "Explore a filterable sample weekly summer camp timetable.",
  ],
  safety: [
    "Safety & care",
    "Read editable examples of camp supervision and family communication.",
  ],
  pricing: [
    "Fees & packages",
    "Compare illustrative half-day, full-day, and multi-week camp fees.",
  ],
  blog: [
    "The Campora journal",
    "Sample stories about camp life, parenting, creativity, and outdoor learning.",
  ],
  contact: [
    "Let’s talk about their summer",
    "Save a local demo camp enquiry. No email is sent.",
  ],
  login: ["Welcome back", "Access the local parent or admin demonstration."],
  register: [
    "Your summer starts here",
    "Create a fictional local demo profile.",
  ],
  "forgot-password": [
    "Find your way back",
    "Demonstration password recovery guidance.",
  ],
  404: [
    "A little off the beaten path",
    "Return to the Campora homepage or browse sample programs.",
  ],
  "coming-soon": [
    "The next adventure is coming",
    "A sample camp launch countdown and local subscription form.",
  ],
};
const parent = [
  "index",
  "programs",
  "children",
  "enrollments",
  "schedule",
  "payments",
  "receipts",
  "notifications",
  "settings",
];
const admin = [
  "index",
  "programs",
  "sessions",
  "enrollments",
  "parents",
  "children",
  "payments",
  "analytics",
  "messages",
  "settings",
];
function shell(page, title, description, prefix = "../") {
  return `<!doctype html>
<html lang="en" data-theme="light" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} | Campora</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title} | Campora">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="#223451">
    <link rel="icon" href="${prefix}assets/images/branding/favicon.ico?v=3" sizes="16x16 32x32 48x48" type="image/x-icon">
    <link rel="icon" href="${prefix}assets/images/branding/favicon-32.png?v=3" sizes="32x32">
    <link rel="apple-touch-icon" href="${prefix}assets/images/branding/apple-touch-icon.png?v=3">
    <script src="${prefix}assets/js/theme.js"></script>
    <link rel="stylesheet" href="${prefix}assets/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="${prefix}assets/vendor/bootstrap-icons/bootstrap-icons.min.css">
    <link rel="stylesheet" href="${prefix}assets/css/style.css">
    <link rel="stylesheet" href="${prefix}assets/css/heroes.css">
    <link rel="stylesheet" href="${prefix}assets/css/polish.css">
    <link rel="stylesheet" href="${prefix}assets/css/access.css">
    <script defer src="${prefix}assets/vendor/chart.umd.min.js"></script>
    <script defer src="${prefix}assets/vendor/jspdf.umd.min.js"></script>
    <script defer src="${prefix}assets/js/data.js"></script>
    <script defer src="${prefix}assets/js/main.js"></script>
    <script defer src="${prefix}assets/js/charts.js"></script>
    <script defer src="${prefix}assets/js/dashboard.js"></script>
    <script defer src="${prefix}assets/js/interactions.js"></script>
  </head>
  <body data-page="${page}">
    <div id="app"></div>
    <noscript>${prefix === "../../" ? `<main class="site-container section"><h1>${title}</h1>` : ""}<p class="site-container">Enable JavaScript for filters, dashboards, and local demo forms.</p>${prefix === "../../" ? "</main>" : ""}</noscript>
  </body>
</html>
`;
}
for (const folder of ["pages", "pages/parent", "pages/admin"])
  fs.mkdirSync(folder, { recursive: true });
for (const [page, [title, desc]] of Object.entries(pages))
  fs.writeFileSync("pages/" + page + ".html", shell(page, title, desc));
for (const [role, list] of [
  ["parent", parent],
  ["admin", admin],
])
  for (const page of list)
    fs.writeFileSync(
      `pages/${role}/${page}.html`,
      shell(
        page,
        `${role === "parent" ? "Parent" : "Admin"} ${page === "index" ? "overview" : page}`,
        `${role === "parent" ? "Family" : "Management"} ${page} screen for the browser-local Campora demonstration.`,
        "../../",
      ),
    );
console.log(
  `Generated ${Object.keys(pages).length + parent.length + admin.length} HTML pages.`,
);

fs.writeFileSync("index.html", fs.readFileSync("pages/index.html", "utf8").replace("<head>", '<head>\n    <base href="./pages/">'));
