# Customization

1. Update design tokens in `assets/css/style.css`. Heading and body fonts use locally hosted Manrope and Inter with system fallbacks. Font licenses are included in `assets/fonts/`.
2. Replace fictional programs, staff, profile data, article text, and sample 2027 dates in `assets/js/data.js`.
3. Adjust public sections in `assets/js/main.js`, dashboards in `assets/js/dashboard.js`, and form behavior in `assets/js/interactions.js`.
4. Public HTML files contain pre-rendered seed content and load shared JavaScript enhancement. For SEO-sensitive production use, generate dedicated URLs and metadata for each program and article with your backend or static generator.
5. Run `npm run build` to regenerate page shells inside `pages/`. Public HTML files are in `pages/`, parent dashboard files in `pages/parent/`, and admin dashboard files in `pages/admin/`. The root `index.html` is only a homepage redirect. Edit titles and descriptions in `scripts/build.cjs` before building.
6. Add real camp contact details, verified staff biographies, operational policies, legal terms, privacy text, refund terms, and licensing details before launch.
7. Keep program prices, sessions, and enrollment records in a shared backend for production. Browser LocalStorage is only a demonstration.
8. Set a canonical domain only after the real deployment address is known. No production URL is invented here.

## RTL and themes

Use the footer RTL button or dashboard settings to toggle direction. The selected direction and theme persist across pages. Theme detection follows the system on first visit. Spacing uses logical properties where needed.

## Third-party libraries

Bootstrap 5.3.3 (MIT), Chart.js 4.4.8 (MIT), jsPDF 2.5.2 (MIT), Bootstrap Icons (MIT), and the licensed font files are locally bundled. Retain their included copyright and license notices.
