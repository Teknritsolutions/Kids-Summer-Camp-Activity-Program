/* Parent and admin views share one local demo store. These pages are intentionally not access controlled. */
(() => {
  if (
    !/\/(parent|admin)\//.test(location.pathname) ||
    document.body.dataset.page === "404"
  )
    return;
  const C = Campora,
    E = C.escape,
    S = C.state;
  const role = location.pathname.includes("/admin/") ? "admin" : "parent";
  const page = document.body.dataset.page;
  const navs =
    role === "admin"
      ? [
          ["index", "Overview", "◫"],
          ["programs", "Programs", "✧"],
          ["sessions", "Sessions", "◷"],
          ["enrollments", "Enrollments", "▤"],
          ["parents", "Parents", "◎"],
          ["children", "Children", "♧"],
          ["payments", "Payments", "▣"],
          ["analytics", "Analytics", "▥"],
          ["messages", "Messages", "✉"],
          ["settings", "Settings", "⚙"],
        ]
      : [
          ["index", "Overview", "◫"],
          ["programs", "Browse Programs", "✧"],
          ["children", "My Children", "♧"],
          ["enrollments", "Enrollments", "▤"],
          ["schedule", "Weekly Schedule", "◷"],
          ["payments", "Payments", "▣"],
          ["receipts", "Receipts", "▧"],
          ["notifications", "Notifications", "♧"],
          ["settings", "Profile & Settings", "⚙"],
        ];
  const current = navs.find((n) => n[0] === page)?.[1] || "Overview";
  C.role = role;
  const table = (headers, rows, label = "Demo records") =>
    `<div class="table-scroll" tabindex="0" role="region" aria-label="${label}"><table><thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">No matching records yet.</td></tr>`}</tbody></table></div>`;
  C.table = table;
  const status = (s) =>
    `<span class="status ${s.toLowerCase()}">${E(s)}</span>`;
  const action = (name, act, id = "", secondary = true) =>
    `<button class="btn btn-${secondary ? "secondary" : "primary"} btn-small" data-action="${act}" data-id="${E(id)}">${name}</button>`;
  C.action = action;
  const record = (e) => ({
    child:
      S.children.find((c) => c.id === e.childId)?.name || "Removed profile",
    program:
      S.programs.find((p) => p.id === e.programId)?.name || "Archived program",
    session: S.sessions.find((s) => s.id === e.sessionId),
  });
  C.record = record;
  let active = S.enrollments.filter((e) => e.status !== "Cancelled");
  let paid = S.enrollments
    .filter((e) => e.paid)
    .reduce((n, e) => n + e.amount, 0);
  let due = active.filter((e) => !e.paid).reduce((n, e) => n + e.amount, 0);
  const chart = (id, title, desc) =>
    `<article class="card chart-card"><h3>${title}</h3><p>${desc}</p><div class="chart-box"><canvas id="${id}" role="img" aria-label="${title}. Values are derived from local demo records."></canvas></div><span class="visually-hidden" id="${id}-summary"></span></article>`;
  const title = (heading, desc, act = "") =>
    `<div class="dash-heading"><div><h2>${heading}</h2><p>${desc}</p></div>${act}</div>`;
  const kpis = (items) =>
    `<div class="grid grid-4 dash-row">${items.map(([label, value, note]) => `<article class="card kpi"><span class="kpi-label">${label}<span aria-hidden="true"><i class='bi bi-arrow-right' aria-hidden='true'></i></span></span><strong>${value}</strong><small>${note}</small></article>`).join("")}</div>`;
  const enrollmentTable = (list = S.enrollments) =>
    table(
      ["Enrollment", "Child & program", "Week", "Status", "Payment", "Actions"],
      list.map((e) => {
        const r = record(e);
        return [
          E(e.id),
          `${E(r.child)}<br><small class="muted">${E(r.program)}</small>`,
          r.session ? C.date(r.session.date) : "Archived session",
          role === "admin"
            ? `<select aria-label="Status for ${E(e.id)}" data-status="${E(e.id)}">${["Confirmed", "Pending", "Waitlisted", "Cancelled"].map((s) => `<option ${e.status === s ? "selected" : ""}>${s}</option>`).join("")}</select>`
            : status(e.status),
          e.paid ? status("Paid") : status("Pending"),
          action("View", "enrollment-view", e.id) +
            (role === "parent" && e.status !== "Cancelled"
              ? action("Cancel", "cancel", e.id)
              : ""),
        ];
      }),
      "Enrollment records",
    );
  C.enrollmentTable = enrollmentTable;
  const payments = () =>
    title(
      "A clear view of camp fees.",
      "All amounts and transactions are simulated.",
    ) +
    kpis([
      [
        "Total recorded fees",
        C.money(paid + due),
        "Paid history + active balance",
      ],
      ["Paid amount", C.money(paid), "Simulated payments"],
      ["Outstanding", C.money(due), "No real money due"],
      [
        "Transactions",
        S.enrollments.filter((e) => e.paid).length,
        "Local receipts available",
      ],
    ]) +
    table(
      ["Enrollment", "Program", "Amount", "Payment status", "Actions"],
      S.enrollments.map((e) => [
        E(e.id),
        E(record(e).program),
        C.money(e.amount),
        status(
          e.paid ? "Paid" : e.status === "Cancelled" ? "Cancelled" : "Pending",
        ),
        e.paid
          ? `<a class="btn btn-secondary btn-small" href="../parent/receipts.html?id=${encodeURIComponent(e.id)}">View receipt</a>`
          : e.status !== "Cancelled"
            ? action("Simulate payment", "pay", e.id, false)
            : "—",
      ]),
      "Demo payments",
    );
  C.dashboardBody = () => {
    active = S.enrollments.filter((e) => e.status !== "Cancelled");
    paid = S.enrollments
      .filter((e) => e.paid)
      .reduce((n, e) => n + e.amount, 0);
    due = active.filter((e) => !e.paid).reduce((n, e) => n + e.amount, 0);
    if (page === "index" || page === "analytics")
      return (
        title(
          page === "analytics"
            ? "The story behind the numbers."
            : role === "parent"
              ? `Hello, ${E(S.profile.name.split(" ")[0])}.`
              : "A good day to make good days.",
          role === "parent"
            ? "A little overview of your family’s next adventures."
            : "Your camp at a glance. Every record here is illustrative.",
          role === "parent"
            ? C.btn("Find an adventure", "parent/programs.html")
            : C.btn("Manage programs", "admin/programs.html", "secondary"),
        ) +
        kpis(
          role === "parent"
            ? [
                [
                  "Registered children",
                  S.children.length,
                  "Ready for their next adventure",
                ],
                [
                  "Active enrollments",
                  active.length,
                  "Confirmed, pending, or waitlisted",
                ],
                [
                  "Upcoming sessions",
                  active.filter(
                    (e) =>
                      record(e).session?.date >=
                      new Date().toISOString().slice(0, 10),
                  ).length,
                  "Scheduled in the demo",
                ],
                ["Pending payments", C.money(due), "Simulated balance"],
              ]
            : [
                [
                  "Total enrollments",
                  S.enrollments.length,
                  "All local records",
                ],
                ["Active programs", S.programs.length, "Open for discovery"],
                ["Total revenue", C.money(paid), "All simulated payments"],
                ["Pending payments", C.money(due), "Active unpaid enrollments"],
              ],
        ) +
        `<div class="grid grid-2 dash-row">${chart("activity-chart", role === "parent" ? "A world of interests" : "Enrollment by activity", "Active enrollment distribution · local demo")}${chart("weekly-chart", role === "parent" ? "A happy weekly rhythm" : "Monthly enrollment trend", role === "parent" ? "Scheduled activities by weekday" : "Enrollment creation dates · local demo")}</div><div class="grid grid-2 dash-row">${chart("status-chart", "Enrollment status", "A clear picture of current records")}${chart("revenue-chart", role === "admin" ? "Revenue by month" : "Program fees at a glance", role === "admin" ? "Paid enrollment history by creation month" : "Paid and outstanding fees by program")}</div>${role === "admin" ? `<div class="grid grid-2 dash-row">${chart("occupancy-chart", "Session occupancy", "Active seats booked per session")}${chart("age-chart", "Age-group participation", "Active enrollments by child’s age")}</div>` : ""}<div class="section-title"><h3>Recent enrollments</h3><a class="text-link" href="enrollments.html">View all</a></div>${enrollmentTable(S.enrollments.slice(-5))}<div class="grid grid-2 mt-4"><article class="card age-card"><h3>Coming up next</h3>${
          active
            .slice(0, 3)
            .map(
              (e) =>
                `<p><strong>${E(record(e).program)}</strong><br>${record(e).session ? C.date(record(e).session.date) : ""} · ${E(record(e).child)}</p>`,
            )
            .join("") || "<p>Your next adventure is waiting to be chosen.</p>"
        }</article><article class="card age-card"><span class="eyebrow">A little reminder</span><h3>Ready, set, summer.</h3><p>Bring a labeled water bottle and a curious mind. All dates and camp guidance are sample content.</p><a class="text-link" href="../safety.html">Explore sample safety guidance</a></article></div>`
      );
    if (page === "programs" && role === "parent")
      return (
        title(
          "Find their next favorite thing.",
          "Explore programs, choose a child, and reserve a sample weekly session.",
        ) +
        C.filters() +
        `<div id="program-count" role="status" class="muted my-4"></div><div class="grid grid-3" id="program-results"></div>`
      );
    if (page === "programs")
      return (
        title(
          "Good programs. Thoughtfully managed.",
          "Changes update the public demo catalog.",
          action("Add program", "program-add", "", false),
        ) +
        table(
          [
            "Program",
            "Category",
            "Age range",
            "Weekly fee",
            "Capacity",
            "Actions",
          ],
          S.programs.map((p) => [
            E(p.name),
            E(p.category),
            `${p.ageMin}–${p.ageMax}`,
            C.money(p.price),
            p.capacity,
            action("Edit", "program-edit", p.id) +
              `<a class="btn btn-secondary btn-small" href="../program-details.html?id=${encodeURIComponent(p.id)}">View</a>` +
              action("Delete", "program-delete", p.id),
          ]),
          "Program management",
        )
      );
    if (page === "children")
      return (
        title(
          role === "parent"
            ? "Their own little profiles."
            : "Meet the demo campers.",
          "Use fictional details only. Age eligibility is checked when enrolling.",
          action("Add child", "child-add", "", false),
        ) +
        `<div class="grid grid-3">${S.children.map((c) => `<article class="card age-card"><span class="avatar">${E(c.name[0])}</span><h3 class="mt-4">${E(c.name)}</h3><span class="badge">Age ${c.age}</span><p class="mt-3">${E(c.interests || "Ready to discover a new interest")}</p><p>${active.filter((e) => e.childId === c.id).length} active demo enrollments</p><div class="actions">${action("Edit", "child-edit", c.id)}${action("Remove", "child-delete", c.id)}</div></article>`).join("") || '<div class="empty-state">Add a fictional child profile to begin.</div>'}</div>`
      );
    if (page === "enrollments")
      return (
        title(
          "Every adventure, in one place.",
          "Review your local demo records and keep track of their progress.",
          role === "parent"
            ? C.btn("New enrollment", "parent/programs.html")
            : "",
        ) +
        `<form id="enrollment-filters" class="toolbar mb-4"><label>Status<select name="status"><option value="">All statuses</option>${["Confirmed", "Pending", "Waitlisted", "Cancelled"].map((s) => `<option>${s}</option>`).join("")}</select></label><label>Program<select name="program"><option value="">All programs</option>${S.programs.map((p) => `<option value="${E(p.id)}">${E(p.name)}</option>`).join("")}</select></label><label>Week starting<input type="date" name="date"></label><button type="reset" class="btn btn-secondary">Reset</button></form><div id="enrollment-results">${enrollmentTable()}</div>`
      );
    if (page === "schedule")
      return (
        title(
          "Their week of little discoveries.",
          "Choose a child and move between sample summer weeks.",
        ) + `<div id="schedule-app" data-family="true"></div>`
      );
    if (page === "payments") return payments();
    if (page === "receipts") {
      const id = new URLSearchParams(location.search).get("id");
      const e = S.enrollments.find((e) => e.id === id && e.paid);
      if (!e)
        return (
          title(
            "A little record of their adventure.",
            "Download real PDFs for simulated payments.",
          ) +
          table(
            ["Receipt", "Program", "Child", "Total", "Action"],
            S.enrollments
              .filter((e) => e.paid)
              .map((e) => [
                E("RC-" + e.id),
                E(record(e).program),
                E(record(e).child),
                C.money(e.amount),
                `<a class="btn btn-secondary btn-small" href="receipts.html?id=${encodeURIComponent(e.id)}">View receipt</a>`,
              ]),
            "Available receipts",
          )
        );
      const r = record(e);
      return `<div class="actions mb-4 no-print">${action("Download PDF", "receipt-pdf", e.id, false)}${action("Print receipt", "print")}<a class="btn btn-secondary" href="receipts.html">All receipts</a></div><article class="receipt"><a class="brand" href="../index.html"><img src="../../assets/images/branding/mark.svg" width="36" height="36" alt="">campora.</a><h2 class="mt-4">Demo payment receipt</h2><p>RC-${E(e.id)} · ${C.date(e.paymentDate || e.created)}</p>${[
        ["Parent", S.profile.name],
        ["Program", r.program],
        ["Child", r.child],
        [
          "Week starting",
          r.session ? C.date(r.session.date) : "Archived session",
        ],
        ["Session", r.session?.time || "—"],
        ["Weekly program fee", C.money(e.amount)],
        ["Total", C.money(e.amount)],
        ["Status", "Paid · Simulated"],
      ]
        .map(
          ([n, v]) =>
            `<div class="receipt-row"><span>${n}</span><strong>${E(v)}</strong></div>`,
        )
        .join(
          "",
        )}<p class="demo-note">This is a demonstration receipt. No real transaction was processed. Campora.</p></article>`;
    }
    if (page === "notifications" || page === "messages") {
      const list = page === "messages" ? S.messages : S.notifications;
      return (
        title(
          page === "messages"
            ? "A little conversation goes a long way."
            : "A little heads-up.",
          "Local demo updates. No external messages are sent.",
        ) +
        list
          .map(
            (n) =>
              `<article class="card notification ${n.read ? "is-read" : ""}"><span class="avatar">${n.read ? "<i class='bi bi-check2' aria-hidden='true'></i>" : "<i class='bi bi-envelope' aria-hidden='true'></i>"}</span><div><span class="badge">${n.read ? "Read" : "Unread"}</span><h3 class="mt-3">${E(n.title || n.subject)}</h3>${n.name ? `<small class="muted">${E(n.name)} · ${E(n.email)}</small>` : ""}<p>${E(n.body)}</p>${n.reply ? `<p><strong>Local draft:</strong> ${E(n.reply)}</p>` : ""}</div><div class="actions">${action(n.read ? "Mark unread" : "Mark read", page === "messages" ? "message-read" : "notification-read", n.id)}${page === "messages" ? action("Save draft reply", "message-reply", n.id) : ""}</div></article>`,
          )
          .join("")
      );
    }
    if (page === "settings")
      return (
        title(
          "A few things, just your way.",
          "Preferences and profile changes are saved in this browser.",
        ) +
        `<div class="grid grid-2"><article class="card age-card"><h3>${role === "admin" ? "Camp details" : "Your demo profile"}</h3><form class="form-grid mt-3" data-form="settings"><label>${role === "admin" ? "Camp" : "Full"} name<input name="name" value="${E(role === "admin" ? S.camp.name : S.profile.name)}" required></label><label>Email address<input name="email" type="email" value="${E(role === "admin" ? S.camp.email : S.profile.email)}" required></label>${role === "parent" ? `<label>Phone<input name="phone" type="tel" value="${E(S.profile.phone)}"></label>` : '<label><input name="notifications" type="checkbox" ' + (S.camp.notifications ? "checked" : "") + "> Enable sample notification preference</label>"}<button class="btn btn-primary">Save demo settings</button><div class="form-feedback" role="status"></div></form></article><article class="card age-card"><h3>Make yourself at home.</h3><p>Switch your theme or preview a right-to-left layout.</p><div class="actions">${action("Switch theme", "theme")}${action("Toggle RTL", "rtl")}</div><hr><h3>A fresh start</h3><p>Resetting removes local demo records and restores the original sample data.</p>${action("Reset demo data", "reset")}</article></div>`
      );
    if (page === "sessions")
      return (
        title(
          "A little structure for a great week.",
          "Manage weekly dates, time slots, mentors, and capacity.",
        ) +
        table(
          [
            "Program",
            "Week starting",
            "Time",
            "Instructor",
            "Seats left",
            "Actions",
          ],
          S.sessions.map((s) => [
            E(S.programs.find((p) => p.id === s.programId)?.name || "Archived"),
            C.date(s.date),
            E(s.time),
            E(s.instructor),
            `${C.available(s)} / ${s.capacity}`,
            action("Edit", "session-edit", s.id),
          ]),
          "Session management",
        )
      );
    if (page === "parents")
      return (
        title(
          "The families behind the adventures.",
          "Fictional local profile information. No real accounts are created.",
        ) +
        `<form id="parent-filters" class="toolbar mb-4"><label>Search parent<input name="search" type="search" placeholder="Name or email"></label><label>Status<select name="status"><option value="">All</option><option>Active</option></select></label></form><div id="parent-results">${table(["Parent", "Email", "Children", "Status"], [[E(S.profile.name), E(S.profile.email), S.children.length, status("Active")]], "Parent records")}</div>`
      );
    return "";
  };
  C.renderDashboard = () => {
    document.getElementById("app").innerHTML =
      `<a class="skip-link" href="#main">Skip to content</a><div class="dashboard"><aside class="sidebar" id="dashboard-sidebar"><a class="brand" href="../index.html"><img src="../../assets/images/branding/mark.svg" alt="" width="36" height="36">campora.</a><span class="sidebar-label">${role.toUpperCase()} SPACE · DEMO</span><nav aria-label="Dashboard navigation">${navs.map(([id, name, icon]) => `<a href="${id}.html" ${page === id ? 'class="active" aria-current="page"' : ""}><i class="bi bi-${{ index: "grid", programs: "compass", sessions: "calendar-week", enrollments: "journal-text", parents: "people", children: "person-heart", payments: "credit-card", analytics: "bar-chart", messages: "envelope", settings: "gear", schedule: "calendar-week", receipts: "receipt", notifications: "bell" }[id]}" aria-hidden="true"></i>${name}</a>`).join("")}</nav><div class="sidebar-bottom"><nav><a href="../index.html"><i class='bi bi-arrow-right' aria-hidden='true'></i> Back to website</a><a href="../login.html" data-logout><i class='bi bi-box-arrow-right' aria-hidden='true'></i> Logout</a></nav><p class="demo-note">A local demo.<br>A world of possibility.</p></div></aside><div class="workspace"><header class="dash-topbar"><div class="actions"><button class="icon-btn menu-toggle" data-action="sidebar" aria-label="Toggle dashboard navigation" aria-controls="dashboard-sidebar" aria-expanded="false"><i class="bi bi-list" aria-hidden="true"></i></button><h1>${current}</h1></div><div class="header-actions">${C.appearanceControls()}<a class="icon-btn" href="${role === "parent" ? "notifications" : "messages"}.html" aria-label="Open notifications"><i class="bi bi-bell" aria-hidden="true"></i></a><span class="avatar">${role === "admin" ? "A" : E(S.profile.name[0])}</span><span class="profile-name field">${role === "admin" ? "Camp admin" : E(S.profile.name)}</span></div></header><main class="dash-content" id="main">${C.dashboardBody()}<p class="demo-note">Front-end demonstration. No real authentication, enrollment, payment, or email is processed. Data stays in this browser.</p></main></div></div>`;
    document.dispatchEvent(new CustomEvent("campora:render"));
  };
  C.renderDashboard();
})();
