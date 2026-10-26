/* Shared public components and page composition. Demo content is intentionally illustrative. */
(() => {
  const C = Campora;
  const E = C.escape;
  const nested =
    /\/(parent|admin)\//.test(location.pathname) &&
    document.body.dataset.page !== "404";
  const root = nested ? "../" : "./";
  C.root = root;
  C.link = (file) =>
    /^(assets|documentation)\//.test(file)
      ? (nested ? "../../" : "../") + file
      : root + file;
  const link = C.link;
  const page = document.body.dataset.page;
  const imageCounts = {};
  const editorialImage = (name) => {
    const id =
      new URLSearchParams(location.search).get("id") ||
      (page === "program-details" ? "arts" : "first-day");
    if (name.startsWith("catalog/"))
      return name.replace("catalog/", "programs/");
    if (
      page === "program-details" &&
      name.startsWith("programs/") &&
      ["sports", "arts", "coding", "swimming", "nature"].includes(id)
    )
      return "editorial/detail-" + id + ".webp";
    if (page === "blog-details" && name.startsWith("programs/"))
      return "editorial/article-" + (id || "first-day") + ".webp";
    const maps = {
      index: {
        "home-1/camp-hero.webp": ["editorial/home1-story.webp"],
        "programs/nature.webp": [
          "editorial/home1-gallery-nature.webp",
          "editorial/home1-safety.webp",
        ],
        "programs/arts.webp": ["editorial/home1-gallery-arts.webp"],
        "programs/sports.webp": ["editorial/home1-gallery-sports.webp"],
      },
      "home-2": {
        "home-1/camp-hero.webp": ["editorial/home2-hero.webp"],
        "programs/nature.webp": [
          "editorial/home2-intro.webp",
          "editorial/home2-week-nature.webp",
        ],
        "programs/coding.webp": ["editorial/home2-week-coding.webp"],
        "programs/arts.webp": ["editorial/home2-memory.webp"],
      },
      about: { "home-1/camp-hero.webp": ["editorial/about-story.webp"] },
      programs: { "programs/arts.webp": ["editorial/programs-help.webp"] },
      "age-groups": {
        "programs/arts.webp": ["editorial/age-little.webp"],
        "programs/sports.webp": ["editorial/age-creative.webp"],
        "programs/coding.webp": ["editorial/age-skills.webp"],
        "programs/nature.webp": ["editorial/age-teen.webp"],
      },
      safety: { "programs/nature.webp": ["editorial/safety-story.webp"] },
      blog: { "programs/nature.webp": ["editorial/blog-feature.webp"] },
      login: { "home-1/camp-hero.webp": ["editorial/auth-login.webp"] },
      register: { "home-1/camp-hero.webp": ["editorial/auth-register.webp"] },
      "forgot-password": {
        "home-1/camp-hero.webp": ["editorial/auth-recovery.webp"],
      },
    };
    const list = maps[page]?.[name];
    if (!list) return name;
    const count = imageCounts[name] || 0;
    imageCounts[name] = count + 1;
    return list[Math.min(count, list.length - 1)];
  };
  const image = (name, alt, cls = "", eager = false) => {
    const path = editorialImage(name);
    const src = link("assets/images/" + path);
    const sizes =
      cls === "adventure-hero__scene"
        ? "100vw"
        : "(max-width: 576px) calc(100vw - 32px), (max-width: 820px) calc(100vw - 48px), 600px";
    const markup = `<img src="${src}" srcset="${src.replace(".webp", "-480.webp")} 480w, ${src.replace(".webp", "-960.webp")} 960w, ${src} 1400w" sizes="${sizes}" alt="${E(alt)}" class="${cls}" width="1000" height="700" loading="${eager ? "eager" : "lazy"}" fetchpriority="${eager ? "high" : "auto"}">`;
    return cls === "split-image"
      ? `<figure class="split-media">${markup}</figure>`
      : markup;
  };
  C.image = image;
  const btn = (text, url, type = "primary") =>
    `<a class="btn btn-${type}" href="${link(url)}">${text} <span aria-hidden="true"><i class='bi bi-arrow-right' aria-hidden='true'></i></span></a>`;
  C.btn = btn;
  const head = (eyebrow, title, text = "", action = "") =>
    `<header class="section-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>${action}</header>`;
  C.head = head;
  const section = (content, alt = false) => {
    let modifier = "";
    if (/id="(?:program|blog)-filters"/.test(content))
      modifier = " section--controls";
    else if (
      content.startsWith('<div class="filter-tabs"') ||
      content.startsWith('<nav class="filter-tabs"')
    )
      modifier = " section--categories";
    else if (/id="(?:program|blog)-results"/.test(content))
      modifier = " section--catalog";
    else if (content.includes('id="load-posts"'))
      modifier = " section--pagination";
    const end = content.indexOf("</header>");
    if (end !== -1) {
      const rest = content.slice(end + 9);
      if (/^<(p|ul|ol|details)\b/.test(rest))
        content =
          content.slice(0, end + 9) +
          '<div class="content-panel' +
          (rest.startsWith("<details") ? " faq-panel" : "") +
          '">' +
          rest +
          "</div>";
    }
    return `<section class="section${alt ? " section--alt" : ""}${modifier}"><div class="site-container">${content}</div></section>`;
  };
  C.section = section;
  const heroScenes = {
    about: [
      "story",
      "Camp counselors and children outside a welcoming wooden cabin",
    ],
    programs: [
      "programs",
      "Children exploring creative art and science activities at camp",
    ],
    "age-groups": [
      "ages",
      "Children of different ages solving an outdoor puzzle together",
    ],
    schedule: ["schedule", "A counselor welcoming children for a new camp day"],
    safety: [
      "safety",
      "A caring counselor helping a child get ready for outdoor activities",
    ],
    pricing: [
      "families",
      "A family exploring camp activities with a counselor",
    ],
    blog: ["journal", "Children drawing and writing in their nature journals"],
    "blog-details": [
      "journal",
      "Children recording summer discoveries in their journals",
    ],
    contact: [
      "contact",
      "A friendly camp coordinator welcoming a parent at the camp office",
    ],
  };
  const banner = (title, desc, label = "A summer with Campora") => {
    const [scene, alt] = heroScenes[page] || [
      "trail",
      "A sunny woodland path leading to a welcoming camp cabin",
    ];
    return `<section class="page-banner image-page-hero"><div class="site-container"><nav aria-label="Breadcrumb" class="breadcrumbs"><a href="${link("index.html")}">Home</a><span aria-hidden="true">/</span><span>${title}</span></nav><div class="image-page-hero__grid"><div class="image-page-hero__copy"><span class="eyebrow">${label}</span><h1>${title}</h1><p>${desc}</p><div class="image-page-hero__accent" aria-hidden="true"><i class="bi bi-sun"></i><span>A little adventure. A world of possibility.</span></div></div><figure class="image-page-hero__media">${image("heroes/" + scene + ".webp", alt, "", true)}<span class="image-page-hero__caption"><i class="bi bi-compass" aria-hidden="true"></i> A summer with Campora</span></figure></div></div></section>`;
  };
  const faq = (items) =>
    items
      .map(
        ([q, a]) =>
          `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`,
      )
      .join("");
  C.faq = faq;
  const commonFaq = [
    [
      "Is this a real camp booking service?",
      "You can explore programs and create browser-local trial enrollments here. No real place is reserved or payment processed.",
    ],
    [
      "What should children bring?",
      "Our sample packing list includes a labeled water bottle, sun hat, comfortable shoes, and a spare layer. Confirm requirements with your actual camp provider.",
    ],
    [
      "How do I choose a program?",
      "Start with your child’s interests, check the age range, and compare half-day and full-day sessions. You can explore the complete demo enrollment flow from the parent dashboard.",
    ],
  ];
  const closing = (title = "Their next big adventure starts here.") =>
    section(
      `<div class="cta"><div><span class="eyebrow">A summer to remember</span><h2>${title}</h2><p>New friends. Fresh discoveries. A little more confidence, every day.</p></div><div class="actions">${btn("Find their adventure", "programs.html")}</div></div>`,
    );
  C.closing = closing;
  const programImage = (p) =>
    C.seed.programs.some((seed) => seed.id === p.id) &&
    (page === "index" || nested)
      ? "editorial/" + (nested ? "parent-" : "home1-") + p.id + ".webp"
      : "catalog/" + p.image;
  const programCard = (p, enroll = true) =>
    `<article class="card program-card">${image(programImage(p), p.name + " — illustrative supervised camp activity", "card-image")}<div class="card-body"><span class="badge">${E(p.category)} · Ages ${p.ageMin}–${p.ageMax}</span><h3>${E(p.name)}</h3><p>${E(p.description)}</p><div class="program-meta"><span><i class='bi bi-clock' aria-hidden='true'></i> ${E(p.duration)}</span><span>${C.state.sessions.filter((s) => s.programId === p.id).reduce((n, s) => n + Math.max(0, C.available(s)), 0)} demo seats</span></div><div class="program-price">${C.money(p.price)} <small>/ week · demo</small></div><div class="actions">${btn("Details", "program-details.html?id=" + encodeURIComponent(p.id), "secondary")}${enroll ? `<a href="${link("parent/programs.html?enroll=" + encodeURIComponent(p.id))}" class="btn btn-primary">Enroll <i class='bi bi-arrow-right' aria-hidden='true'></i></a>` : ""}</div></div></article>`;
  C.programCard = programCard;
  const programs = (limit = 3) =>
    `<div class="grid grid-3">${C.state.programs
      .slice(0, limit)
      .map((p) => programCard(p))
      .join("")}</div>`;
  const storyPoints = {
    index: [
      "Creative challenges with room to experiment",
      "Outdoor time and new friendships",
      "A chance to share one proud moment",
    ],
    "home-2": [
      "A mix of active and quiet moments",
      "Simple choices that encourage independence",
      "Shared projects with a memorable finish",
    ],
    about: [
      "Learning each child’s interests",
      "Welcoming different ways to participate",
      "Celebrating kindness as well as achievement",
    ],
    programs: [
      "Age ranges shown on every program",
      "Dates and sample fees to compare",
      "Activity outcomes explained before enrollment",
    ],
    safety: [
      "Confirm individual needs before arrival",
      "Agree on emergency contact details",
      "Review authorized pickup arrangements",
    ],
  };
  const storyDetails = {
    index:
      "From the first hello to the last proud goodbye, the day makes room for shared projects, outdoor play, and small discoveries. Children can try a new interest, practice at their own pace, and celebrate what they have made together.",
    "home-2":
      "A balanced camp day moves between hands-on activities, fresh air, and time to reconnect. There is space for lively teamwork and quieter moments, so every child can find a rhythm that feels comfortable.",
    about:
      "Belonging grows through everyday moments: learning a new name, sharing materials, or helping a teammate finish a challenge. Our sample program brings those moments together through creative projects, outdoor exploration, and time to reflect.",
    programs:
      "Compare the activity, age range, session length, and weekly fee before choosing a program. Each program page includes example outcomes and session dates, so families can explore a week that suits their child’s interests and routine.",
    safety:
      "Clear arrival routines, regular water breaks, and age-appropriate activities help children settle into the day. Families can use the enquiry form to discuss individual needs and confirm the arrangements with their actual camp provider.",
  };
  const story = (
    eyebrow,
    title,
    copy,
    name = "home-1/camp-hero.webp",
    reverse = false,
  ) =>
    `<div class="split">${!reverse ? image(name, title, "split-image") : ""}<div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p>${copy}</p><p>${storyDetails[eyebrow === "Peace of mind comes along" ? "safety" : page] || "Explore activities that balance creativity, movement, and time with friends. Check the program details for age guidance and sample session options before planning your child’s week."}</p><ul class="check-list">${(storyPoints[eyebrow === "Peace of mind comes along" ? "safety" : page] || storyPoints.programs).map((point) => `<li>${point}</li>`).join("")}</ul>${btn("Get to know Campora", "about.html", "secondary")}</div>${reverse ? image(name, title, "split-image") : ""}</div>`;
  const ages = [
    [
      "4–6",
      "Little Explorers",
      "Gentle beginnings, creative play, and first discoveries.",
    ],
    [
      "7–9",
      "Creative Adventurers",
      "New interests, growing friendships, and hands-on fun.",
    ],
    [
      "10–12",
      "Skill Builders",
      "Meaningful challenges and room to try something bold.",
    ],
    [
      "13–16",
      "Teen Trailblazers",
      "Independence, teamwork, and ideas with real purpose.",
    ],
  ];
  const baseAgeCards = () =>
    `<div class="grid grid-4">${ages.map(([age, title, desc]) => `<article class="card age-card"><div class="age">${age}<small class="muted"> yrs</small></div><h3>${title}</h3><p>${desc}</p><a class="text-link" href="${link("programs.html?age=" + age.replace("–", "-"))}">Explore programs</a></article>`).join("")}</div>`;
  const baseRoutine = () =>
    `<div class="timeline">${[
      ["8:30 AM", "A warm welcome", "Settle in, say hello, and get ready."],
      [
        "9:00 AM",
        "Let curiosity lead",
        "Explore a favorite activity with your group.",
      ],
      ["12:00 PM", "Lunch & connection", "Refuel, relax, and swap stories."],
      ["1:00 PM", "Something new", "An afternoon of projects and discovery."],
      ["4:00 PM", "Happy goodbyes", "Share a highlight and head home."],
    ]
      .map(
        ([time, title, desc]) =>
          `<div class="timeline-item"><time>${time}</time><h3>${title}</h3><p>${desc}</p></div>`,
      )
      .join("")}</div>`;
  const baseTestimonials = () =>
    `<div class="grid grid-3">${[
      [
        "We loved seeing Jamie come home with a new story and the confidence to try again.",
        "Alex M.",
        "Parent of a curious maker",
      ],
      [
        "The balance of outdoor time and creative projects made every day feel different.",
        "Avery P.",
        "Parent of a little explorer",
      ],
      [
        "A thoughtful rhythm, friendly faces, and space for our child to be themselves.",
        "Morgan R.",
        "Parent of a first-time camper",
      ],
    ]
      .map(
        ([quote, name, role], index) =>
          `<article class="card"><div class="card-body"><p class="quote">${quote}</p><div class="person">${image("portraits/parent-" + index + ".webp", name + " — fictional parent portrait", "avatar testimonial-avatar")}<div><strong>${name}</strong><small>${role} · Demo story</small></div></div></div></article>`,
      )
      .join("")}</div>`;
  const basePlans = () =>
    `<div class="grid grid-3">${[
      [
        "Half-day discovery",
        185,
        "A gentle start to a big summer.",
        [
          "9 AM–12 PM, Monday to Friday",
          "Arts or nature program",
          "Materials and mentor support",
        ],
      ],
      [
        "Full-day adventure",
        245,
        "A whole day of possibility.",
        [
          "9 AM–4 PM, Monday to Friday",
          "Sports, coding, or swimming",
          "Materials and mentor support",
        ],
      ],
      [
        "Two-week explorer",
        370,
        "More time to grow into it.",
        [
          "Two half-day program weeks",
          "Choose two available sessions",
          "Materials and mentor support",
        ],
      ],
    ]
      .map(
        ([name, price, desc, features], i) =>
          `<article class="card pricing-card ${i === 1 ? "featured" : ""}"><span class="badge">${i === 1 ? "A full summer day" : "Flexible by design"}</span><h3 class="mt-4">${name}</h3><p>${desc}</p><div class="price">${C.money(price)}<small> / ${i === 2 ? "two weeks" : "week"}</small></div><ul class="check-list">${features.map((f) => `<li>${f}</li>`).join("")}</ul>${btn("Choose a program", "programs.html")}</article>`,
      )
      .join(
        "",
      )}</div><p class="demo-note">Illustrative USD prices. Two half-day weeks are charged at $185 each. Select each session in the demo enrollment flow. No real payment is collected.</p>`;
  C.plans = (...args) => plans(...args);
  const fields = (mode) => {
    const password = (name, label, autocomplete) =>
      `<label>${label}<div class="password-wrap"><input name="${name}" type="password" autocomplete="${autocomplete}" minlength="8" required placeholder="${name === "confirm" ? "Re-enter your password" : "Enter at least 8 characters"}"><button type="button" class="icon-btn" data-action="password" aria-label="Show ${name === "confirm" ? "confirm password" : "password"}"><i class="bi bi-eye" aria-hidden="true"></i></button></div></label>`;
    let markup =
      mode === "register"
        ? '<label>Full name<input name="name" autocomplete="name" placeholder="e.g. Alex Morgan" required></label>'
        : "";
    markup +=
      '<label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>';
    if (mode === "register")
      markup += `<label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="e.g. +91 98765 43210" required></label><label>Child’s age group<select name="ageGroup"><option value="">Select age group</option><option>4–6 years</option><option>7–9 years</option><option>10–12 years</option><option>13–16 years</option></select></label><label>Camp experience<select name="experience"><option value="">Select experience</option><option>First camp adventure</option><option>Has attended camp before</option></select></label><label>Interested program<select name="interest"><option value="">Select an interest</option>${C.state.programs.map((p) => '<option value="' + E(p.id) + '">' + E(p.name) + "</option>").join("")}</select></label>`;
    if (mode !== "forgot-password")
      markup += password(
        "password",
        "Password",
        mode === "register" ? "new-password" : "current-password",
      );
    if (mode === "register")
      markup +=
        password("confirm", "Confirm password", "new-password") +
        '<div class="auth-strength"><span class="auth-strength__bar"><i></i></span><strong data-password-strength>Not set</strong><small>Use at least 8 characters with a mix of letters and numbers.</small></div><label class="auth-consent"><input type="checkbox" required> I understand that this profile is saved locally and this is a trial account.</label>';
    return markup;
  };
  const postCard = (p) =>
    `<article class="card journal-card" id="story-${p.id}">${image("editorial/blog-" + p.id + ".webp", p.title, "card-image")}<div class="card-body"><span class="badge">${p.category}</span><h3>${p.title}</h3><p>${p.intro}</p>${page === "blog" ? `<details class="journal-story"><summary class="text-link">Read the story</summary>${p.sections.map(([heading, copy]) => `<h4>${E(heading)}</h4><p>${E(copy)}</p>`).join("")}</details>` : `<a class="text-link" href="${link("blog.html#story-" + p.id)}">Read the story</a>`}</div></article>`;
  C.postCard = postCard;
  C.appearanceControls = () =>
    `<button class="icon-btn" data-action="theme" aria-label="Switch color theme" title="Switch to dark mode"><i class="bi bi-moon-stars" aria-hidden="true"></i></button><button class="direction-toggle" data-action="rtl" aria-label="Switch to RTL layout" title="Switch to right-to-left layout"><i class="bi bi-text-right" aria-hidden="true"></i><span data-direction-label>RTL</span></button>`;
  C.publicHeader = () => {
    const rememberedRole =
      sessionStorage.getItem("campora-role") ||
      localStorage.getItem("campora-role");
    const accountUrl = ["parent", "admin"].includes(rememberedRole)
      ? rememberedRole + "/index.html"
      : "login.html";
    const accountLabel = ["parent", "admin"].includes(rememberedRole)
      ? "Dashboard"
      : "Parent login";
    const nav = [
      ["About Us", "about"],
      ["Programs", "programs"],
      ["Age Groups", "age-groups"],
      ["Schedule", "schedule"],
      ["Safety", "safety"],
      ["Fees", "pricing"],
      ["Blog", "blog"],
      ["Contact Us", "contact"],
    ];
    return `<a href="#main" class="skip-link">Skip to content</a><header class="site-header"><div class="site-container header-inner"><a class="brand" href="${link("index.html")}" aria-label="Campora home"><img src="${link("assets/images/branding/mark.svg")}" alt="" width="36" height="36">campora<span aria-hidden="true">.</span></a><button class="nav-backdrop" data-action="close-menu" aria-label="Dismiss navigation" tabindex="-1"></button><nav class="nav" id="public-nav" aria-label="Main navigation"><div class="drawer-heading"><h2>Navigation</h2><button class="icon-btn drawer-close" data-action="close-menu" aria-label="Close navigation"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div><details><summary>Home</summary><div><a href="${link("index.html")}">Home Page 1</a><a href="${link("home-2.html")}">Home Page 2</a></div></details>${nav.map(([name, id]) => `<a href="${link(id + ".html")}" ${page === id ? 'class="active" aria-current="page"' : ""}>${name}</a>`).join("")}<details><summary>Dashboard</summary><div>${[
      ["Parent Dashboard", "parent/index.html"],
      ["Admin Dashboard", "admin/index.html"],
    ]
      .map(([n, u]) => `<a href="${link(u)}">${n}</a>`)
      .join(
        "",
      )}</div></details><div class="drawer-settings"><button class="drawer-setting" data-action="theme" aria-label="Change appearance"><span>Appearance</span><strong data-theme-label>Dark mode</strong></button><button class="drawer-setting" data-action="rtl"><span>Reading direction</span><strong data-direction-label>RTL</strong></button><a class="btn btn-primary" href="${link(accountUrl)}"><i class="bi bi-person" aria-hidden="true"></i> ${accountLabel}</a></div></nav><div class="header-actions">${C.appearanceControls()}<a class="btn btn-navy btn-small" href="${link(accountUrl)}">${accountLabel} <i class='bi bi-arrow-right' aria-hidden='true'></i></a><button class="icon-btn menu-toggle" data-action="menu" aria-controls="public-nav" aria-expanded="false" aria-label="Open navigation"><i class="bi bi-list" aria-hidden="true"></i></button></div></div></header>`;
  };
  C.footer = () =>
    `<footer class="site-footer"><div class="site-container"><div class="footer-grid"><div><a class="brand" href="${link("index.html")}"><img src="${link("assets/images/branding/mark.svg")}" alt="" width="36" height="36">campora.</a><p>A little adventure.<br>A whole summer of possibility.</p><nav class="footer-socials" aria-label="Social media"><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram" title="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Facebook" title="Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit YouTube" title="YouTube"><i class="bi bi-youtube" aria-hidden="true"></i></a><a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Pinterest" title="Pinterest"><i class="bi bi-pinterest" aria-hidden="true"></i></a></nav></div><div><h3>Discover</h3>${[
      ["Our story", "about"],
      ["Our programs", "programs"],
      ["A day at camp", "schedule"],
      ["Safety & care", "safety"],
    ]
      .map(([n, u]) => `<a href="${link(u + ".html")}">${n}</a>`)
      .join("")}</div><div><h3>For families</h3>${[
      ["Fees & packages", "pricing"],
      ["Camp journal", "blog"],
      ["Parent dashboard", "parent/index"],
      ["Get in touch", "contact"],
    ]
      .map(([n, u]) => `<a href="${link(u + ".html")}">${n}</a>`)
      .join(
        "",
      )}</div><div><h3>Let’s stay curious</h3><p>Occasional inspiration for your next adventure.</p><form data-form="subscribe" class="form-grid"><label>Email address<input type="email" name="email" placeholder="you@example.com" required></label><button class="btn btn-secondary btn-small">Join the demo list <i class='bi bi-arrow-right' aria-hidden='true'></i></button><div class="form-feedback" role="status"></div></form></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Campora. All rights reserved.</span><span class="footer-signoff">Made for a summer of discovery.</span></div></div></footer>`;
  const filters = () =>
    `<form id="program-filters" class="toolbar"><label>Find their next favorite thing<input type="search" name="search" placeholder="Search programs…"></label><label>Activity<select name="category"><option value="">All activities</option>${["Sports", "Arts", "Coding", "Swimming", "Nature"].map((x) => `<option>${x}</option>`).join("")}</select></label><label>Age group<select name="age"><option value="">All ages</option>${ages.map(([a, t]) => `<option value="${a.replace("–", "-")}">${a} · ${t}</option>`).join("")}</select></label><label>Weekly budget<select name="price"><option value="">Any price</option><option value="200">Up to $200</option><option value="250">Up to $250</option></select></label><label>Week starting<select name="date"><option value="">Any week</option>${["2027-06-07", "2027-06-14", "2027-06-21"].map((d) => `<option value="${d}">${C.date(d)}</option>`).join("")}</select></label><button type="reset" class="btn btn-secondary">Reset</button></form>`;
  C.filters = filters;
  const weekendImages = {
    "Make a backyard field guide": [
      "field-guide",
      "A child sketching backyard leaves in a nature journal",
    ],
    "Build with what you find": [
      "cardboard-build",
      "Children creating a miniature village from cardboard boxes",
    ],
    "Collect a proud moment": [
      "proud-moment",
      "A family sharing a handmade craft and celebrating a proud moment",
    ],
  };
  const topicCards = (items) =>
    `<div class="grid grid-3">${items
      .map(([icon, title, copy], i) => {
        const photo = weekendImages[title];
        if (photo)
          return `<article class="card weekend-photo-card" tabindex="0" aria-labelledby="weekend-title-${i}" aria-describedby="weekend-copy-${i}">${image("weekend/" + photo[0] + ".webp", photo[1], "weekend-photo-card__image")}<div class="weekend-photo-card__content"><span class="weekend-photo-card__number"><i class="bi bi-${icon}" aria-hidden="true"></i> ${String(i + 1).padStart(2, "0")}</span><h3 id="weekend-title-${i}">${title}</h3><p id="weekend-copy-${i}">${copy}</p></div><span class="weekend-photo-card__hint" aria-hidden="true"><i class="bi bi-plus-lg"></i></span></article>`;
        return `<article class="card age-card"><span class="badge"><i class="bi bi-${icon}" aria-hidden="true"></i> ${String(i + 1).padStart(2, "0")}</span><h3 class="mt-3">${title}</h3><p>${copy}</p></article>`;
      })
      .join("")}</div>`;
  const ageCards = () =>
    page !== "age-groups"
      ? baseAgeCards()
      : `<div class="table-scroll" role="region" aria-label="Age readiness comparison" tabindex="0"><table><thead><tr><th>Stage</th><th>A helpful sign</th><th>A good first step</th></tr></thead><tbody>${[
          [
            "Ages 4–6",
            "Enjoys short activities with a familiar routine",
            "Try a gentle half-day of creative play.",
          ],
          [
            "Ages 7–9",
            "Wants to join group games and make new friends",
            "Explore a mix of art and cooperative sport.",
          ],
          [
            "Ages 10–12",
            "Likes practicing a skill or solving a challenge",
            "Choose a focused coding or making project.",
          ],
          [
            "Ages 13–16",
            "Seeks independence and shared responsibility",
            "Look for collaborative projects and leadership opportunities.",
          ],
        ]
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody></table></div>`;
  const routine = () =>
    page === "program-details"
      ? topicCards([
          [
            "lightbulb",
            "Discover the challenge",
            "Meet the mentor, explore the materials, and choose a small goal for the session.",
          ],
          [
            "tools",
            "Try, practice, create",
            "Work through a guided activity with time to experiment and ask questions.",
          ],
          [
            "chat-heart",
            "Share the discovery",
            "Show the group what worked, discuss a new idea, and celebrate progress.",
          ],
        ])
      : page === "schedule"
        ? `<div class="timeline timeline--four">${[
            [
              "Before arrival",
              "Check the day’s plan",
              "Confirm the session time and pack labeled belongings the evening before.",
            ],
            [
              "At check-in",
              "Settle into the group",
              "Share any updates with the staff lead and confirm the pickup arrangement.",
            ],
            [
              "During the day",
              "Leave room for breaks",
              "Activity blocks include time to pause, drink water, and reconnect with friends.",
            ],
            [
              "At pickup",
              "Bring the story home",
              "Collect projects, check belongings, and ask your child about one discovery.",
            ],
          ]
            .map(
              ([time, title, copy]) =>
                `<div class="timeline-item"><time>${time}</time><h3>${title}</h3><p>${copy}</p></div>`,
            )
            .join("")}</div>`
        : baseRoutine();
  const plans = () =>
    page !== "home-2"
      ? basePlans()
      : topicCards([
          [
            "compass",
            "Start with their interests",
            "Ask what they would love to try: making, moving, exploring, or building something new.",
          ],
          [
            "calendar-week",
            "Find your family’s week",
            "Compare the sample dates and half-day or full-day routine before choosing a session.",
          ],
          [
            "backpack",
            "Get ready together",
            "Make a packing list, talk through the first morning, and give your child a small choice to own.",
          ],
        ]) +
        `<div class="actions mt-4">${btn("Compare weekly fees", "pricing.html", "secondary")}${btn("Plan a camp week", "schedule.html")}</div>`;
  const testimonials = () =>
    page !== "about"
      ? baseTestimonials()
      : topicCards([
          [
            "people",
            "A welcome with a name",
            "Small-group introductions and shared activities help each child find a place in the group.",
          ],
          [
            "palette",
            "Progress worth noticing",
            "A finished sketch, a first attempt, or a helpful gesture can become the highlight of the day.",
          ],
          [
            "chat-dots",
            "A story to share",
            "Simple reflection prompts help children describe their experience in their own words.",
          ],
        ]);
  const pageQuestions = {
    programs: [
      [
        "How can I compare activities?",
        "Use the category, age, budget, and week filters to narrow the catalog, then open a program for its sample outcomes and session dates.",
      ],
      [
        "Can I explore more than one interest?",
        "Compare different weekly sessions in the catalog. Each demo enrollment is for one child, program, and session.",
      ],
      [
        "What if no program matches my filters?",
        "Reset one or more filters to widen the results, or use the contact page to save a local enquiry.",
      ],
    ],
    "program-details": [
      [
        "How do I choose a session for this activity?",
        "Review the available-session table and select a week. The parent demo lets you choose a child before confirming the enrollment.",
      ],
      [
        "Where can I see what my child will try?",
        "The exploration list on this page describes sample outcomes, and the workshop flow shows how an activity can progress.",
      ],
      [
        "Is a place reserved when I browse this page?",
        "No. Browsing does not reserve a place. Any enrollment created here is an illustrative browser-local record.",
      ],
    ],
    safety: [
      [
        "How should I share individual care needs?",
        "Contact your actual provider before attendance to discuss allergies, medication, access needs, and any agreed support plan.",
      ],
      [
        "What should I confirm about pickup?",
        "Ask the provider how authorized adults are recorded, how identity is checked, and how changes to collection arrangements are handled.",
      ],
      [
        "Are the policies on this page verified?",
        "The guidance here is a starting point for family questions. Confirm the venue’s current procedures and staff qualifications before attendance.",
      ],
    ],
    pricing: [
      [
        "Which fee applies to my enrollment?",
        "The selected program’s weekly price is shown in its details and again before demo confirmation. Package cards are illustrative comparisons.",
      ],
      [
        "Are transport or lunch added at checkout?",
        "No paid extras are offered in the demo. Lunch, transport, and extended care are excluded from the sample fees.",
      ],
      [
        "Will the payment button charge my card?",
        "No. Payment is a local simulation, and the generated receipt is marked as a demonstration.",
      ],
    ],
    contact: [
      [
        "Where does my enquiry go?",
        "The form saves a fictional enquiry in this browser’s local demo inbox. It does not send email or contact a real camp.",
      ],
      [
        "What details are helpful to include?",
        "Mention the activity, your child’s age range, and the week you are considering. Please use fictional details in this demo.",
      ],
      [
        "Can I change an existing enrollment here?",
        "Use the parent dashboard to review or cancel a local demo enrollment. This enquiry form does not edit bookings.",
      ],
    ],
  };
  const contextualFaq = () => faq(pageQuestions[page] || commonFaq);
  C.renderPublic = () => {
    switch (page) {
      case "index":
        return (
          `<section class="adventure-hero">
            <div class="site-container">
              <div class="adventure-hero__stage">
                ${image("home-1/hero-adventure-v2.webp", "Children and a counselor enjoying an outdoor team game at summer camp", "adventure-hero__scene", true)}
                <div class="adventure-hero__shade" aria-hidden="true"></div>
                <div class="adventure-hero__copy">
                  <span class="eyebrow">A summer made for discovery</span>
                  <h1>Their summer.<br>A world of<br><em>possibility.</em></h1>
                  <p>New friendships, hands-on discoveries, and adventures that help them grow. Give their curiosity a summer of its own.</p>
                  <div class="actions">${btn("Explore our programs", "programs.html")}${btn("Discover Campora", "about.html", "secondary")}</div>
                </div>
                <div class="adventure-hero__moments" aria-label="More ways to discover">
                  <figure>${image("home-1/hero-makers-v2.webp", "Children making a paper sculpture with an arts instructor", "", true)}<figcaption><i class='bi bi-palette' aria-hidden='true'></i> Little makers. Big ideas.</figcaption></figure>
                  <figure>${image("home-1/hero-robotics-v2.webp", "Children testing a robot with their camp mentor", "", true)}<figcaption><i class='bi bi-cpu' aria-hidden='true'></i> Curiosity, in motion.</figcaption></figure>
                </div>
              </div>
              <div class="adventure-hero__facts">
                <div><i class='bi bi-people' aria-hidden='true'></i><span><strong>A place for every stage</strong>Ages 4–16</span></div>
                <div><i class='bi bi-compass' aria-hidden='true'></i><span><strong>Follow their interests</strong>Five activity paths</span></div>
                <div><i class='bi bi-calendar-week' aria-hidden='true'></i><span><strong>A rhythm that fits</strong>Flexible weekly sessions</span></div>
              </div>
            </div>
          </section>` +
          section(
            `<div class="grid grid-4">${[
              [
                "<i class='bi bi-palette' aria-hidden='true'></i>",
                "Create something wonderful",
                "Color outside the lines and let imagination take the lead.",
              ],
              [
                "<i class='bi bi-compass' aria-hidden='true'></i>",
                "Find their wild side",
                "Fresh air, open spaces, and a new discovery around every corner.",
              ],
              [
                "<i class='bi bi-person-check' aria-hidden='true'></i>",
                "Learn with good people",
                "Warm, encouraging mentors who make room for every child.",
              ],
              [
                "<i class='bi bi-shield-check' aria-hidden='true'></i>",
                "Feel right at home",
                "Thoughtful routines and a welcoming place to belong.",
              ],
            ]
              .map(
                ([icon, title, text]) =>
                  `<article class="highlight"><span class="feature-icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${text}</p></article>`,
              )
              .join("")}</div>`,
            true,
          ) +
          section(
            head(
              "Find their thing",
              "So many ways to make a summer.",
              "For the makers, the movers, the thinkers, and the “can we try that?” kids.",
              `<a class="text-link" href="programs.html">See all programs</a>`,
            ) + programs(),
          ) +
          section(
            story(
              "The Campora way",
              "Growing confidence.<br>One happy day at a time.",
              "We believe the best summers give children something they can carry into every season: curiosity, connection, and a little courage. Our sample camp experience is built around all three.",
            ),
            true,
          ) +
          section(
            head(
              "Every age. A new adventure.",
              "A place for their kind of curious.",
              "From first camp days to bigger independent steps, explore a stage that fits.",
            ) + ageCards(),
          ) +
          section(
            head(
              "A day at Campora",
              "A happy rhythm. Room for surprises.",
              "Our sample full-day routine balances focused activities, rest, and open-ended play.",
            ) + routine(),
            true,
          ) +
          section(
            head(
              "The moments that stay",
              "Less screen time. More remember-when.",
              "A little glimpse of the days we imagine together.",
            ) +
              `<div class="gallery">${[
                ["nature.webp", "A discovery around every corner"],
                ["arts.webp", "Proudly made by little hands"],
                ["sports.webp", "Better when we play together"],
              ]
                .map(
                  ([im, caption]) =>
                    `<figure>${image("programs/" + im, caption)}<figcaption>${caption}</figcaption></figure>`,
                )
                .join("")}</div>`,
          ) +
          section(
            story(
              "Peace of mind comes along",
              "Their adventure.<br>Your reassurance.",
              "Clear check-in routines, attentive adults, and open communication shape our illustrative care approach. Actual policies must be reviewed and adapted by your camp operator.",
              "programs/nature.webp",
              true,
            ),
            true,
          ) +
          section(
            head(
              "Words from our demo families",
              "Happy campers. Happy hearts.",
              "A few imagined family moments, inspired by the small discoveries that make summer memorable.",
            ) + testimonials(),
          ) +
          closing()
        );
      case "home-2":
        return (
          `<section class="section editorial-hero scenic-hero"><div class="site-container scenic-hero__stage"><div class="scenic-hero__background is-active" data-hero-scene="0">${image("home-1/camp-hero.webp", "Children hiking with their counselor beside a mountain lake", "", true)}</div><div class="scenic-hero__background" data-hero-scene="1" aria-hidden="true">${image("heroes/trail.webp", "A sunny woodland path leading to a welcoming camp cabin")}</div><div class="scenic-hero__copy"><span class="eyebrow">Out there is where it begins</span><h1>More muddy shoes.<br>More <em>“I did it!”</em> moments.</h1><p>A summer for trying, making, finding, and becoming. Let’s see where their curiosity takes them.</p><div class="actions">${btn("Make this summer theirs", "programs.html")}</div></div><div class="scenic-hero__controls" aria-label="Hero photographs"><button class="scenic-hero__dot" data-action="hero-scene" data-id="0" aria-label="Show lakeside hiking photo" aria-pressed="true">01</button><button class="scenic-hero__dot" data-action="hero-scene" data-id="1" aria-label="Show woodland camp photo" aria-pressed="false">02</button></div></div></section>` +
          section(
            story(
              "Hello, summer",
              "Big experiences.<br>Beautifully simple days.",
              "A welcoming place where the next question matters more than the perfect answer. Explore our illustrative camp story.",
              "programs/nature.webp",
              true,
            ),
          ) +
          section(
            head(
              "Follow their curiosity",
              "Five paths. Endless possibilities.",
            ) +
              `<div class="grid grid-3">${C.state.programs.map((p) => `<a class="card age-card scenic-activity" href="programs.html?category=${p.category}">${image("catalog/" + p.image, p.name + " camp activity", "scenic-activity__photo")}<div class="scenic-activity__copy"><span class="eyebrow">${p.category}</span><h3>${p.name}</h3><p>${p.outcomes[0]}</p><span class="text-link">Discover this activity</span></div></a>`).join("")}<a class="card age-card scenic-activity" href="programs.html">${image("heroes/programs.webp", "Children discovering creative art and science activities", "scenic-activity__photo")}<div class="scenic-activity__copy"><span class="eyebrow">Explore & discover</span><h3>Find Their Next Favorite</h3><p>A little making, a little moving. Explore every activity and find their spark.</p><span class="text-link">Explore all programs</span></div></a></div>`,
            true,
          ) +
          section(
            head(
              "A season in numbers",
              "Small groups. Big possibility.",
              "Illustrative program information from our demo schedule.",
            ) +
              `<div class="grid grid-4">${[
                [C.state.programs.length, "Activity paths"],
                [C.state.sessions.length, "Weekly sessions"],
                ["4–16", "Ages welcome"],
                ["3", "Summer weeks"],
              ]
                .map(
                  ([n, t]) =>
                    `<div class="card kpi"><strong>${n}</strong><span>${t}</span></div>`,
                )
                .join("")}</div>`,
          ) +
          section(
            head(
              "A week worth looking forward to",
              "Something new on the horizon.",
            ) +
              `<div class="grid grid-2">${[
                [
                  "Trail Tales",
                  "Follow the woodland path, keep a nature journal, and discover tiny ecosystems.",
                ],
                [
                  "Build Something Brilliant",
                  "A week of simple robots, shared puzzles, and big ideas in motion.",
                ],
              ]
                .map(
                  ([t, d], i) =>
                    `<article class="card">${image("programs/" + (i ? "coding.webp" : "nature.webp"), t, "card-image")}<div class="card-body"><span class="badge">Week ${i + 1} · June 2027</span><h3>${t}</h3><p>${d}</p>${btn("Explore the week", "programs.html?category=" + (i ? "Coding" : "Nature"), "secondary")}</div></article>`,
                )
                .join("")}</div>`,
            true,
          ) +
          section(
            head(
              "Good people make the difference",
              "Meet a few friendly faces.",
              "Meet the activity roles that help turn curiosity into a shared project.",
            ) +
              `<div class="grid grid-3">${C.state.programs
                .slice(0, 3)
                .map(
                  (p, index) =>
                    `<article class="card age-card">${image("editorial/mentor-" + index + ".webp", p.mentor + " — fictional mentor portrait", "mentor-portrait")}<h3 class="mt-4">${p.mentor}</h3><span class="badge">${p.category} mentor · Demo</span><p class="mt-3">Encourages thoughtful exploration through ${p.category.toLowerCase()} activities. Makes space for questions, shared ideas, and progress at each child’s pace.</p></article>`,
                )
                .join("")}</div>`,
          ) +
          section(
            head("Find your family’s rhythm", "A summer that fits.") + plans(),
            true,
          ) +
          section(
            head(
              "Keep the curiosity going",
              "Little adventures for the weekend.",
            ) +
              topicCards([
                [
                  "leaf",
                  "Make a backyard field guide",
                  "Look for three different leaves, sketch their shapes, and invent a name for each discovery.",
                ],
                [
                  "box",
                  "Build with what you find",
                  "Turn a few clean cardboard boxes into a miniature camp, bridge, or imaginative invention.",
                ],
                [
                  "stars",
                  "Collect a proud moment",
                  "Invite everyone to share something they tried this week and one thing they would love to try next.",
                ],
              ]),
          ) +
          section(
            head(
              "From the family journal",
              "The best souvenir is a story.",
              "An illustrative parent memory from our demo camp.",
            ) +
              `<div class="split family-story"><div><span class="eyebrow">Small moments, lasting memories</span><h2>A little more confidence to bring home.</h2><p class="quote">The little things became the big things: a new friend, a project finished, a trail explored. That is the summer we wanted.</p><p>In this fictional family story, the best part of each afternoon is hearing what happened that day: a shared idea, a new skill, or the moment a tricky project finally came together.</p><p>Those everyday discoveries become stories to tell at the dinner table, with something new to look forward to tomorrow.</p><strong>Alex Morgan · Fictional parent story</strong></div>${image("programs/arts.webp", "A creative summer memory", "split-image")}</div>`,
            true,
          ) +
          closing("Let this be their “remember that summer?”")
        );
      case "about":
        return (
          banner(
            "A little camp. A bigger purpose.",
            "We imagine a summer where children feel welcome, discover what excites them, and grow in their own way.",
            "Our story",
          ) +
          section(
            story(
              "Built around belonging",
              "The best adventures<br>start with feeling at home.",
              "Campora is an illustrative camp brand designed around a simple idea: give curious children thoughtful experiences and the freedom to make them their own.",
            ),
          ) +
          section(
            head("What guides us", "Curiosity. Kindness. Courage.") +
              `<div class="grid grid-3">${[
                [
                  "Curiosity",
                  "We invite questions and leave room for unexpected discoveries.",
                ],
                [
                  "Kindness",
                  "We model cooperation, listening, and respect for different perspectives.",
                ],
                [
                  "Courage",
                  "We celebrate trying, practicing, and finding a way forward.",
                ],
              ]
                .map(
                  ([t, d]) =>
                    `<article class="card age-card"><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join("")}</div>`,
            true,
          ) +
          section(
            head(
              "People with a purpose",
              "Meet the demo camp team.",
              "Illustrative team profiles: a friendly face for each kind of adventure.",
            ) +
              `<div class="grid grid-3">${C.state.programs
                .slice(0, 3)
                .map(
                  (p, index) =>
                    `<article class="card age-card team-profile">${image("editorial/mentor-" + index + ".webp", p.mentor + " — fictional camp team member", "team-profile__portrait")}<h3 class="mt-4">${p.mentor}</h3><span class="badge">${p.category} lead</span><p class="mt-3">Helps children explore new ideas through collaborative ${p.category.toLowerCase()} projects. Encourages teamwork, thoughtful questions, and the confidence to try again.</p></article>`,
                )
                .join("")}</div>`,
          ) +
          section(
            head("An editable camp journey", "A story you can make your own.") +
              `<div class="timeline">${[
                ["01", "An idea takes root"],
                ["02", "A thoughtful program"],
                ["03", "A welcoming team"],
                ["04", "Our first camp days"],
                ["05", "The next adventure"],
              ]
                .map(
                  ([n, t]) =>
                    `<div class="timeline-item"><time>Milestone ${n}</time><h3>${t}</h3><p>An idea grows through thoughtful planning, shared experiences, and feedback from families.</p></div>`,
                )
                .join("")}</div>`,
            true,
          ) +
          section(
            head(
              "Belonging in practice",
              "The moments that shape our camp.",
              "How the Campora philosophy comes to life in everyday activities.",
            ) +
              testimonials() +
              `<div class="actions mt-4">${btn("Talk to our team", "contact.html")}</div>`,
          )
        );
      case "programs":
        return (
          banner(
            "Find their kind of adventure.",
            "A little making, a little moving, a whole lot of discovery. Explore our sample programs and find a good fit.",
            "Our programs",
          ) +
          section(filters()) +
          section(
            `<nav class="filter-tabs" aria-label="Activity shortcuts">${["All", "Sports", "Arts", "Coding", "Swimming", "Nature"].map((x, i) => `<a class="chip" href="${link("programs.html" + (i ? "?category=" + encodeURIComponent(x) : "") + "#program-count")}" data-category="${i ? x : ""}" ${!i ? 'aria-current="page"' : ""}>${x}</a>`).join("")}</nav>`,
          ) +
          section(
            `<div id="program-count" role="status" class="muted mb-4"></div><div id="program-results" class="grid grid-3"></div>`,
            true,
          ) +
          section(
            story(
              "Not sure where to begin?",
              "Start with a spark.<br>We’ll help with the rest.",
              "Choose a favorite interest or try something completely new. Each program includes an age range, a sample schedule, and room to grow.",
              "programs/arts.webp",
              true,
            ),
          ) +
          section(
            head(
              "A little more clarity",
              "Good questions. Thoughtful answers.",
            ) +
              contextualFaq() +
              `<div class="actions mt-4">${btn("Start a demo enrollment", "parent/programs.html")}</div>`,
          )
        );
      case "program-details": {
        const p = C.state.programs.find(
          (x) =>
            x.id === (new URLSearchParams(location.search).get("id") || "arts"),
        );
        if (!p)
          return (
            banner(
              "That adventure is not here.",
              "The program may have changed. Browse the current demo selection.",
            ) + closing("Find another spark of curiosity.")
          );
        document.title = p.name + " | Campora";
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", p.description);
        return (
          section(
            `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="programs.html">Programs</a> / ${E(p.name)}</nav><div class="split">${image("programs/" + p.image, p.name, "split-image", true)}<div><span class="badge">${p.duration} · Weekly sessions</span><h1>${E(p.name)}</h1><span class="badge">Ages ${p.ageMin}–${p.ageMax}</span><p>${E(p.description)}</p><div class="price">${C.money(p.price)}<small> / week · demo</small></div>${btn("Begin demo enrollment", "parent/programs.html?enroll=" + p.id)}</div></div>`,
          ) +
          section(
            head("Small steps. Real discovery.", "What they’ll explore.") +
              `<ul class="check-list">${p.outcomes.map((o) => `<li>${o}</li>`).join("")}</ul>`,
            true,
          ) +
          section(
            head("Inside the workshop", "From first idea to proud finish.") +
              routine(),
          ) +
          section(
            head("Choose your week", "Space for their next adventure.") +
              `<div class="table-scroll" tabindex="0" role="region" aria-label="Available sessions"><table><thead><tr><th>Week starting</th><th>Session</th><th>Available seats</th><th>Weekly fee</th><th>Action</th></tr></thead><tbody>${C.state.sessions
                .filter((s) => s.programId === p.id)
                .map(
                  (s) =>
                    `<tr><td>${C.date(s.date)}</td><td>${E(s.time)}</td><td>${C.available(s)}</td><td>${C.money(p.price)}</td><td>${btn("Select", "parent/programs.html?enroll=" + p.id, "secondary")}</td></tr>`,
                )
                .join("")}</tbody></table></div>`,
            true,
          ) +
          section(
            head(
              "A friendly face along the way",
              E(p.mentor),
              `Fictional ${p.category.toLowerCase()} mentor · ${E(p.area)}. Explore the activity goals and discuss individual needs before choosing a session.`,
            ) +
              `<p>Activities follow an illustrative small-group routine with check-in, supervised sessions, breaks, and authorized pickup. Consult your actual provider for operational policies.</p>`,
          ) +
          section(
            head("Before the adventure", "A few helpful answers.") +
              contextualFaq() +
              `<div class="actions mt-4">${btn("Browse related programs", "programs.html?category=" + p.category)}</div>`,
            true,
          )
        );
      }
      case "age-groups":
        return (
          banner(
            "Room to grow. At every age.",
            "Explore a sample camp experience built around your child’s stage, interests, and independence.",
            "Age groups",
          ) +
          ages
            .map(([age, title, desc], i) =>
              section(
                `<div class="split">${i % 2 === 0 ? image("programs/" + ["arts.webp", "sports.webp", "coding.webp", "nature.webp"][i], title, "split-image") : ""}<div><span class="eyebrow">Ages ${age}</span><h2>${title}</h2><p>${desc}</p><ul class="check-list"><li>${["Playful making and gentle nature walks", "Cooperative games and creative projects", "Hands-on problem solving and skill practice", "Independent projects and team leadership"][i]}</li><li>Supportive pacing and age-appropriate challenges</li><li>Time to connect with peers and mentors</li></ul>${btn("Find their programs", "programs.html?age=" + age.replace("–", "-"))}</div>${i % 2 ? image("programs/" + ["arts.webp", "sports.webp", "coding.webp", "nature.webp"][i], title, "split-image") : ""}</div>`,
                i % 2 === 0,
              ),
            )
            .join("") +
          section(
            head(
              "A good fit makes all the difference",
              "Compare their next steps.",
            ) + ageCards(),
          )
        );
      case "schedule":
        return (
          banner(
            "A week full of possibility.",
            "See how a sample camp week balances creative discovery, active play, and well-earned downtime.",
            "The camp rhythm",
          ) +
          section(
            head("The week ahead", "Five days. Fresh discoveries.") +
              `<p>Our illustrative summer sessions begin June 7, 14, and 21, 2027. Select an activity and age group below to explore a sample weekday timetable.</p>`,
          ) +
          section(`<div id="schedule-app"></div>`, true) +
          section(
            head("Make the schedule yours", "Find a rhythm that fits.") +
              `<p>Use the activity and age controls above to narrow the timetable. Half-day programs finish at noon; full-day programs finish at 4 PM. Program session dates can be selected during enrollment.</p>${btn("Compare program options", "programs.html", "secondary")}`,
          ) +
          section(
            head("A smoother camp day", "Your arrival-to-pickup guide.") +
              routine(),
            true,
          ) +
          section(
            head(
              "Put a little summer on the calendar",
              "Important sample dates.",
            ) +
              `<div class="grid grid-3">${["2027-06-07", "2027-06-14", "2027-06-21"].map((d) => `<article class="card age-card"><span class="eyebrow">Week starting</span><h3>${C.date(d)}</h3><p>Monday–Friday · Choose an available weekly session.</p>${btn("See availability", "programs.html?date=" + d, "secondary")}</article>`).join("")}</div>`,
          )
        );
      case "safety":
        return (
          banner(
            "Adventure, with a little reassurance.",
            "Thoughtful routines and clear communication help families feel comfortable. All policies below are editable examples.",
            "Safety & care",
          ) +
          section(
            story(
              "A thoughtful foundation",
              "Care is part of<br>every camp day.",
              "A welcoming environment begins with attentive adults, predictable routines, and space for children to ask for help. This is a sample approach, not a verified safety guarantee.",
              "programs/nature.webp",
            ),
          ) +
          section(
            head("People and procedures", "A shared responsibility.") +
              `<div class="grid grid-3">${[
                [
                  "Group supervision",
                  "Sample policy: assign a named staff lead to each activity group and confirm attendance at transitions.",
                ],
                [
                  "Staff preparation",
                  "Ask about staff screening, relevant training, activity qualifications, and who leads your child’s group.",
                ],
                [
                  "Clear communication",
                  "Sample policy: agree on a contact process with families before the first session.",
                ],
              ]
                .map(
                  ([t, d]) =>
                    `<article class="card age-card"><h3>${t}</h3><p>${d}</p></article>`,
                )
                .join("")}</div>`,
            true,
          ) +
          section(
            head("From arrival to pickup", "A clear handover, every time.") +
              `<div class="timeline">${["Welcome & attendance", "Confirm contact details", "Authorized pickup list", "Identity check", "Recorded handover"].map((t, i) => `<div class="timeline-item"><time>Step ${i + 1}</time><h3>${t}</h3><p>Illustrative process. Adapt to local operational requirements.</p></div>`).join("")}</div>`,
          ) +
          section(
            head(
              "Prepared for the everyday",
              "Small habits. Thoughtful care.",
            ) +
              faq([
                [
                  "Health & hygiene",
                  "Sample guidance: provide handwashing breaks and ask families to follow the camp’s actual illness policy.",
                ],
                [
                  "Swimming activities",
                  "Sample guidance: assess ability before activities and ensure qualified supervision. Confirm the pool’s ability checks, supervision, and water-safety arrangements before attendance.",
                ],
                [
                  "Emergency preparedness",
                  "Before the first day, ask how emergency contacts, staff responsibilities, and activity-specific response arrangements are managed.",
                ],
              ]),
            true,
          ) +
          section(
            `<div class="care-conversation"><header class="care-conversation__intro"><span class="eyebrow">Keep the conversation open</span><h2>Your questions are always welcome.</h2><p>Prepare for their first day with a few clear conversations about care, collection, and support.</p>${btn("Ask about care", "contact.html")}</header><div class="care-conversation__topics">${pageQuestions.safety.map(([question, answer], index) => `<article class="care-conversation__topic"><span class="care-conversation__icon"><i class="bi bi-${["heart-pulse", "person-check", "clipboard-check"][index]}" aria-hidden="true"></i></span><div><h3>${question}</h3><p>${answer}</p></div></article>`).join("")}</div></div>`,
          )
        );
      case "pricing":
        return (
          banner(
            "A summer that fits your family.",
            "Simple sample packages, clear inclusions, and a flexible weekly rhythm. All prices are illustrative USD amounts.",
            "Fees & packages",
          ) +
          section(
            head(
              "More room for possibility",
              "Choose the shape of their summer.",
            ) +
              `<p>Half-day sessions focus on arts or nature. Full-day sessions include sports, coding, or swimming. Choose the program first, then a matching weekly session.</p>`,
          ) +
          section(plans(), true) +
          section(
            head(
              "Thoughtfully included",
              "The essentials for a good camp day.",
            ) +
              `<div class="grid grid-2"><div><h3>Included in sample fees</h3><ul class="check-list"><li>Scheduled program activities</li><li>Standard project materials</li><li>Mentor support during sessions</li></ul></div><div><h3>Plan ahead</h3><p>Lunch, transport, and extended care are not included in this demo. No paid add-ons are offered in checkout. Add real options only after confirming your operational pricing.</p></div></div>`,
          ) +
          section(
            head("Clear from the start", "A simple demo payment process.") +
              `<ol><li>Select a program, child, and session.</li><li>Review the exact weekly fee before confirming.</li><li>Mark your enrollment paid using a clearly labeled simulation.</li><li>Download a local demo PDF receipt.</li></ol><p class="demo-note">No real money changes hands in this payment simulation. Confirm cancellation and refund terms with your actual activity provider before booking.</p>`,
            true,
          ) +
          section(
            head("The practical details", "A few common questions.") +
              contextualFaq() +
              `<div class="actions mt-4">${btn("Explore available programs", "programs.html")}</div>`,
          )
        );
      case "blog":
        return (
          banner(
            "Notes from a curious summer.",
            "Ideas for family adventures, little discoveries, and a happy first day. All articles are illustrative editorial content.",
            "The Campora journal",
          ) +
          section(
            head(
              "A good place to begin",
              "For their first big little adventure.",
            ) +
              `<div class="split">${image("programs/nature.webp", "Outdoor discovery", "split-image")}<div><span class="badge">Parenting Tips · June 1, 2027</span><h2>${C.state.posts[0].title}</h2><p>${C.state.posts[0].intro}</p>${btn("Read the story", "blog.html#story-first-day", "secondary")}</div></div>`,
          ) +
          section(
            `<form id="blog-filters" class="toolbar"><label>Find a story<input name="search" type="search" placeholder="Search the journal"></label><label>Category<select name="category"><option value="">All stories</option>${["Camp Life", "Parenting Tips", "Outdoor Learning", "Creative Activities", "Safety", "Announcements"].map((c) => `<option>${c}</option>`).join("")}</select></label><button class="btn btn-secondary" type="reset">Reset</button></form>`,
          ) +
          section(`<div id="blog-results" class="grid grid-3"></div>`, true) +
          section(
            `<button class="btn btn-secondary" id="load-posts">Load more stories <i class='bi bi-arrow-right' aria-hidden='true'></i></button><p id="blog-count" class="muted mt-3" role="status"></p>`,
          ) +
          section(
            head("A little inspiration in your inbox", "Stay in the loop.") +
              `<p>Join a local demo list. This form saves a preference in your browser; it does not send email.</p><form data-form="subscribe" class="toolbar"><label>Email address<input type="email" name="email" required></label><button class="btn btn-primary">Join demo list <i class='bi bi-arrow-right' aria-hidden='true'></i></button><div role="status" class="form-feedback"></div></form>`,
          )
        );
      case "contact":
        return (
          banner(
            "Let’s talk about their summer.",
            "Questions about activities, age groups, or planning the first day? Start your summer conversation here.",
            "Say hello",
          ) +
          section(
            `<div class="grid grid-3">${[
              [
                "Find your fit",
                "Programs for curious minds",
                "Compare creative, active, and outdoor experiences for ages 4–16.",
              ],
              [
                "Hyderabad",
                "Public Gardens Road",
                "Nampally, Hyderabad, Telangana 500004 · Local map reference",
              ],
              [
                "Before you travel",
                "Plan your visit",
                "Confirm the activity venue, session time, and arrival arrangements before setting out.",
              ],
            ]
              .map(
                ([t, d, n]) =>
                  `<article class="card age-card"><span class="eyebrow">${t}</span><h3>${d}</h3><p>${n}</p></article>`,
              )
              .join("")}</div>`,
          ) +
          section(
            `<div class="split"><div class="contact-panel"><span class="eyebrow">A good conversation starts here</span><h2>What’s on your mind?</h2><p>This demonstration saves your message to the local admin inbox. It does not send email. Please use fictional details.</p><figure class="contact-panel__image">${image("editorial/auth-register.webp", "A parent and child arriving at a welcoming lakeside summer camp")}<figcaption>Every adventure starts with a conversation.</figcaption></figure></div><form data-form="contact" class="form-grid"><label>Your name<input name="name" required maxlength="80"></label><label>Email address<input name="email" type="email" required></label><label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label><label>Subject<input name="subject" required maxlength="120"></label><label>Your message<textarea name="body" required maxlength="2000"></textarea></label><button class="btn btn-primary">Save demo enquiry <i class='bi bi-arrow-right' aria-hidden='true'></i></button><div role="status" class="form-feedback"></div></form></div>`,
            true,
          ) +
          section(
            `<div class="hyderabad-location"><div class="hyderabad-location__info"><span class="eyebrow">Explore Hyderabad</span><h2>A little closer to your next adventure.</h2><address><strong>Public Gardens Road, Nampally</strong><br>Hyderabad, Telangana 500004, India</address><p>Use this Hyderabad landmark to explore the area. Confirm your activity’s exact venue before travelling.</p><a class="btn btn-navy" href="https://www.google.com/maps/search/?api=1&query=Public+Gardens+Nampally+Hyderabad+Telangana+500004" target="_blank" rel="noopener noreferrer">Open Google Maps <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a></div><iframe class="hyderabad-location__map" title="Google Map of Public Gardens Road, Nampally, Hyderabad" src="https://maps.google.com/maps?q=Public%20Gardens%20Nampally%20Hyderabad%20Telangana%20500004&z=15&output=embed" width="800" height="460" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`,
          ) +
          section(
            head("Before you get in touch", "A few helpful answers.") +
              contextualFaq(),
            true,
          ) +
          section(
            `<div class="visit-planner"><div class="visit-planner__intro"><span class="eyebrow">Let’s plan a great first day</span><h2>Small questions. A confident start.</h2><p>Bring your child’s interests, your preferred week, and a few questions. Find a program that feels right for your family.</p>${btn("Find their program", "programs.html")}</div><div class="visit-planner__steps">${[
              [
                "compass",
                "Choose an adventure",
                "Explore activities together and let your child pick something they would love to try.",
              ],
              [
                "calendar-check",
                "Check your week",
                "Review age guidance, session dates, and the daily routine before making plans.",
              ],
              [
                "chat-heart",
                "Talk through the details",
                "Ask about what to bring, individual needs, arrival, and collection arrangements.",
              ],
            ]
              .map(
                ([icon, title, copy]) =>
                  `<article><span><i class="bi bi-${icon}" aria-hidden="true"></i></span><div><h3>${title}</h3><p>${copy}</p></div></article>`,
              )
              .join("")}</div></div>`,
          )
        );
      case "login":
      case "register":
      case "forgot-password": {
        const title =
          page === "login"
            ? "Welcome back, adventurer."
            : page === "register"
              ? "Your summer starts here."
              : "Let’s find your way back.";
        const registering = page === "register";
        return `<section class="access-layout"><aside class="access-story"><div class="access-story__top"><span class="eyebrow">${registering ? "A summer of possibility" : "Your family’s camp space"}</span><span class="access-edition">FAMILY ACCESS · ${registering ? "02" : "01"}</span></div><a class="brand" href="index.html"><img src="../assets/images/branding/mark.svg" alt="" width="36" height="36">campora.</a><h2>${registering ? "Their next adventure starts with you." : "Welcome back to their summer story."}</h2><p>${registering ? "Build a family profile, explore their interests, and plan a week of new friends and discoveries." : "Keep their activities, weekly schedule, and camp memories together in one welcoming place."}</p>${image("access/" + (registering ? "registration" : "login") + ".webp", registering ? "A parent and child meeting a camp mentor at a creative activity table" : "A parent greeting their child and counselor at summer camp", "access-story__image", true)}<div class="access-story__note"><i class="bi bi-sun" aria-hidden="true"></i> Small discoveries. A summer to remember.</div></aside><div class="access-form-panel"><span class="eyebrow">${registering ? "New family access" : page === "forgot-password" ? "Find your way back" : "Parent access"}</span><header class="access-form-heading"><h1>${registering ? "Create your account" : page === "forgot-password" ? "Reset your password" : "Sign in to Campora"}</h1><p>${registering ? "Set up your family profile and take the first step toward their next adventure." : page === "forgot-password" ? "Enter your email to view the recovery guidance for this local account." : "Welcome back. Let’s see what their next camp day has in store."}</p></header><form data-form="${page}" class="form-grid access-form ${registering ? "access-form--register" : ""}">${registering ? '<fieldset class="access-role"><legend>I am a</legend><label><input type="radio" name="relationship" value="parent" checked><span>Parent</span></label><label><input type="radio" name="relationship" value="guardian"><span>Guardian</span></label></fieldset>' : ""}${fields(page)}${page === "login" ? '<div class="access-login-options"><label><input type="checkbox" name="remember"> Remember this browser</label><a href="forgot-password.html">Forgot password?</a></div>' : ""}<button class="btn btn-navy access-submit">${registering ? "Create account" : page === "login" ? "Sign in" : "View recovery guidance"} <i class="bi bi-arrow-right" aria-hidden="true"></i></button><div role="status" class="form-feedback"></div></form>${page === "login" ? '<div class="access-demo"><span>Explore the local trial</span><div class="actions"><button class="btn btn-secondary btn-small" data-demo="parent">Try parent demo</button><button class="btn btn-secondary btn-small" data-demo="admin">Try admin demo</button></div></div>' : ""}<div class="access-switch">${registering ? 'Already have an account? <a href="login.html">Sign in <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' : page === "login" ? 'New to Campora? <a href="register.html">Create an account <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' : '<a href="login.html">Back to sign in</a>'}</div><p class="access-local-note"><i class="bi bi-info-circle" aria-hidden="true"></i> Local trial only. Account data stays in this browser; authentication and email delivery are not connected. Use a sample password.</p></div></section>`;
      }
      case "404":
        return `<section class="center-page">${image("heroes/trail.webp", "A woodland trail leading back to camp", "utility-hero-image", true)}<span class="big-number">404</span><h1>A little off the beaten path.</h1><p>The page you’re looking for has wandered off. There’s still plenty of adventure ahead.</p><div class="actions">${btn("Back to home", "index.html")}${btn("Find a program", "programs.html", "secondary")}</div></section>`;
      case "coming-soon":
        return `<section class="launch-page"><div class="launch-page__copy"><a class="brand launch-page__brand" href="${link("index.html")}" aria-label="Campora home"><img src="${link("assets/images/branding/mark.svg")}" alt="" width="36" height="36">campora.</a><span class="eyebrow">Something good is growing</span><h1>A new season of little adventures.</h1><p>More discoveries, new friendships, and days worth remembering. Count down to our next season, starting June 7, 2027.</p><div id="countdown" class="countdown launch-countdown" aria-label="Time until the next season"></div><form data-form="subscribe" class="launch-signup"><label for="launch-email">Be part of the next adventure</label><div class="launch-signup__row"><input id="launch-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required><button class="btn btn-primary">Join the list <i class="bi bi-arrow-right" aria-hidden="true"></i></button></div><small>Registration of interest is saved in this browser only. No email is sent.</small><div role="status" class="form-feedback"></div></form><a class="launch-home" href="${link("index.html")}"><i class="bi bi-arrow-left" aria-hidden="true"></i> Back to Campora</a></div><figure class="launch-page__visual">${image("heroes/trail.webp", "A sunny woodland path leading to a welcoming camp cabin", "launch-page__image", true)}<figcaption><span><i class="bi bi-sun" aria-hidden="true"></i> Summer starts with possibility.</span><strong>A little adventure.<br>A whole lot to look forward to.</strong></figcaption></figure></section>`;
      default:
        return "";
    }
  };
  if (!nested && page !== "documentation") {
    const standalone = ["login", "register", "404", "coming-soon"].includes(
      page,
    );
    document.getElementById("app").innerHTML =
      (standalone
        ? `<a href="#main" class="skip-link">Skip to content</a><div class="access-appearance" aria-label="Appearance settings">${C.appearanceControls()}</div>`
        : C.publicHeader()) +
      `<main id="main">${C.renderPublic()}</main>` +
      (standalone ? "" : C.footer());
  }
})();
