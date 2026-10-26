# Campora — Kids Summer Camp & Activity Program

A buildless multipage HTML template for Campora. All people, dates, prices, bookings, and policies are illustrative.

## Run locally

Install Node.js, then run `node scripts/serve.cjs` from this folder. Open http://127.0.0.1:4173. No package installation is needed to run the website. Keep the origin/port the same to retain local demo data. `npm start` also works in a standard terminal; use `npm.cmd start` if PowerShell blocks npm scripts.

Run `npm run build` after changing the HTML shell generator or shared public content. This regenerates page shells and pre-renders public seed content inside `pages/`. Format with `node node_modules/prettier/bin/prettier.cjs --write "assets/js/*.js" "assets/css/*.css" "scripts/*.cjs" "index.html" "pages/**/*.html"` after installing development packages.

For browser verification, install development packages with `npm install`, start the local server, and run `node tests/audit.cjs`, `node tests/interactions.cjs`, and `node tests/assets.cjs`. A Playwright Chromium installation is required for tests; it is not needed to run the website.

## Demo access

Open `pages/login.html` and choose **Try parent demo** or **Try admin demo**. No credentials are required. The regular login accepts any valid fictional email and sample password of at least eight characters. Registration saves a fictional profile and never stores passwords. Dashboard URLs are public demo pages, not secure routes.

## Pages and structure

```text
campora/
├── index.html              # Entry redirect to pages/index.html
├── pages/
│   ├── index.html          # Home Page 1
│   ├── home-2.html
│   ├── about.html
│   ├── programs.html
│   ├── ...                 # All public and utility HTML pages
│   ├── parent/             # 9 parent dashboard pages
│   └── admin/              # 10 admin dashboard pages
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── fonts/
│   └── vendor/
├── documentation/
├── scripts/
└── tests/
```

All 36 application pages live inside `pages/`. The root `index.html` only redirects visitors to the homepage. Shared assets and documentation stay outside the page directory.

- 17 public and utility pages: two homepages, about, programs, dynamic program details, age groups, schedule, safety, pricing, blog, dynamic article details, contact, login, register, forgot password, 404, and coming soon.
- 9 parent screens: overview, programs, children, enrollments, schedule, payments, receipts, notifications, settings.
- 10 admin screens: overview, programs, sessions, enrollments, parents, children, payments, analytics, messages, settings.
- `assets/css/style.css`: shared tokens, components, public layouts, dashboards, themes, RTL-compatible logical spacing, and responsive rules.
- `assets/js/data.js`: fictional initial records and local persistence.
- `assets/js/main.js`: reusable public components and page composition.
- `assets/js/dashboard.js`: dashboard layout and views.
- `assets/js/interactions.js`: filtering, forms, enrollment, CRUD dialogs, receipts, and timetable behavior.
- `assets/js/charts.js`: charts derived from local records.
- `assets/js/theme.js`: early theme and direction initialization.
- `assets/images/`: 58 original generated photos, including three new homepage hero images, with responsive WebP sizes, SVG branding, PNG icons, and an editable fictional map. The former hero photo is retained as an unused source asset.
- `assets/vendor/`: local Bootstrap, Chart.js, and jsPDF distributions.
- `documentation/`: customization, image provenance, and demo limitations.
- `scripts/`: shell generation, public pre-rendering, image import, local font preparation, and local server.
- `tests/`: browser audit.

## Interactions

Program search and activity/age/budget/date filters; distinct program/article details; journal search/category/load more; weekday schedule filters and sample-week navigation; theme and RTL persistence; keyboard-friendly navigation and dialogs; local contact inbox; demo profile creation; child add/edit/remove; six-step enrollment with age, duplicate, and capacity checks; cancellation; simulated payments; genuine PDF downloads and printable receipts; admin program/session editing; shared enrollment status changes; read/unread messages and notifications; local draft replies; profile settings; and reset demo data.

Use **Settings → Reset demo data** to restore initial records. All state is stored under `campora-demo-v1` in LocalStorage. No data is sent to a backend.

See `documentation/validation.md` for actual verification results. See `documentation/demo-limitations.md` before production use.
