/* All mutations are browser-local demonstrations. User-entered strings are escaped on output. */
(() => {
  const C = Campora,
    E = C.escape;
  let previousFocus;
  C.toast = (text) => {
    document.querySelector(".toast")?.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = text;
    document.body.append(el);
    setTimeout(() => el.remove(), 5000);
  };
  C.closeModal = () => {
    document.querySelector(".modal-backdrop")?.remove();
    previousFocus?.focus();
  };
  C.modal = (title, content) => {
    if (!document.querySelector(".modal-backdrop"))
      previousFocus = document.activeElement;
    document.querySelector(".modal-backdrop")?.remove();
    const el = document.createElement("div");
    el.className = "modal-backdrop";
    el.innerHTML = `<section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Close dialog"><i class='bi bi-x-lg' aria-hidden='true'></i></button></div>${content}</section>`;
    document.body.append(el);
    labelControls(el);
    el.querySelector("input,select,button")?.focus();
    el.addEventListener("click", (e) => {
      if (e.target === el) C.closeModal();
    });
  };
  const saveRender = () => {
    C.save();
    C.closeModal();
    C.renderDashboard?.();
  };
  const field = (label, name, value = "", type = "text", extra = "") =>
    `<label>${label}<input name="${name}" type="${type}" value="${E(value)}" ${extra}></label>`;
  const options = (items, value) =>
    items
      .map(
        ([v, t]) =>
          `<option value="${E(v)}" ${String(value) === String(v) ? "selected" : ""}>${E(t)}</option>`,
      )
      .join("");
  const formModal = (title, kind, id, content) =>
    C.modal(
      title,
      `<form class="form-grid" data-form="${kind}" data-id="${E(id || "")}">${content}<div class="actions"><button class="btn btn-primary">Save demo changes</button><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button></div><div class="form-feedback" role="status"></div></form>`,
    );
  let wizard;
  function enroll(programId) {
    const p = C.state.programs.find((p) => p.id === programId);
    if (!p) return C.toast("Choose an available program.");
    if (!C.state.children.length) {
      C.modal(
        "Add a little adventurer first.",
        `<p>Create a fictional child profile before starting an enrollment.</p>${C.btn("Add a child", "parent/children.html")}`,
      );
      return;
    }
    wizard = { step: 0, programId, childIds: [], date: "", sessionId: "" };
    renderWizard();
  }
  function renderWizard(error = "") {
    const W = wizard,
      S = C.state,
      p = S.programs.find((p) => p.id === W.programId);
    const sessions = S.sessions.filter((s) => s.programId === p.id);
    const titles = [
      "Choose a program",
      "Choose your campers",
      "Choose a week",
      "Choose a session",
      "A little review",
      "You’re ready to explore",
    ];
    let body = "";
    if (W.step === 0)
      body = `<label>Program<select id="wizard-program">${options(
        S.programs.map((p) => [p.id, p.name]),
        W.programId,
      )}</select></label><p class="mt-3">${E(p.description)}</p><span class="badge">Ages ${p.ageMin}–${p.ageMax} · ${C.money(p.price)} per child / week</span>`;
    if (W.step === 1)
      body = `<p>Choose one or more eligible children. Age is checked against the program’s ${p.ageMin}–${p.ageMax} range.</p>${S.children
        .map((c) => {
          const ok = c.age >= p.ageMin && c.age <= p.ageMax;
          return `<label class="choice"><input type="checkbox" name="wizard-child" value="${E(c.id)}" ${W.childIds.includes(c.id) ? "checked" : ""} ${ok ? "" : "disabled"}><span>${E(c.name)} · Age ${c.age}${ok ? "" : " · Outside this program’s age range"}</span></label>`;
        })
        .join("")}`;
    if (W.step === 2)
      body = `<label>Week starting<select id="wizard-date"><option value="">Select a week</option>${options(
        [...new Set(sessions.map((s) => s.date))].map((d) => [d, C.date(d)]),
        W.date,
      )}</select></label><p class="mt-3">Each booking covers a Monday–Friday program week.</p>`;
    if (W.step === 3)
      body = `<label>Available time slot<select id="wizard-session"><option value="">Select a session</option>${options(
        sessions
          .filter(
            (s) => s.date === W.date && C.available(s) >= W.childIds.length,
          )
          .map((s) => [s.id, `${s.time} · ${C.available(s)} seats available`]),
        W.sessionId,
      )}</select></label><p class="mt-3">Capacity is checked again when you confirm.</p>`;
    if (W.step === 4) {
      const s = S.sessions.find((s) => s.id === W.sessionId);
      body = `<p><strong>${E(p.name)}</strong><br>${W.childIds.map((id) => E(S.children.find((c) => c.id === id).name)).join(", ")}<br>${C.date(W.date)} · ${E(s.time)}</p><div class="receipt-row"><span>${W.childIds.length} × weekly fee</span><strong>${C.money(p.price * W.childIds.length)}</strong></div><p class="demo-note">No real booking or payment is made. This action creates local pending enrollments. A simulated payment can be completed separately.</p><label><input id="wizard-accept" type="checkbox"> I understand this is a local demonstration.</label>`;
    }
    if (W.step === 5)
      body = `<span class="badge">Demo enrollment saved</span><h3 class="mt-4">A little adventure is on the calendar.</h3><p>Your pending enrollment is visible in both dashboards. Continue to payments to complete the simulation.</p><div class="actions">${C.btn("View enrollments", "parent/enrollments.html")}${C.btn("Demo payments", "parent/payments.html", "secondary")}</div>`;
    C.modal(
      titles[W.step],
      `<div class="step-label">STEP ${Math.min(W.step + 1, 6)} OF 6</div>${body}${error ? `<p class="form-feedback mt-3" role="alert">${E(error)}</p>` : ""}${W.step < 5 ? `<div class="actions mt-4">${W.step ? '<button class="btn btn-secondary" data-action="wizard-back">Back</button>' : ""}<button class="btn btn-primary" data-action="wizard-next">${W.step === 4 ? "Confirm demo enrollment" : "Continue"} <i class='bi bi-arrow-right' aria-hidden='true'></i></button></div>` : ""}`,
    );
  }
  function wizardNext() {
    const W = wizard,
      S = C.state;
    if (W.step === 0) {
      W.programId = document.getElementById("wizard-program").value;
      W.childIds = [];
      W.date = "";
      W.sessionId = "";
    }
    if (W.step === 1) {
      W.childIds = [
        ...document.querySelectorAll("[name=wizard-child]:checked"),
      ].map((i) => i.value);
      if (!W.childIds.length)
        return renderWizard("Please select at least one eligible child.");
    }
    if (W.step === 2) {
      W.date = document.getElementById("wizard-date").value;
      W.sessionId = "";
      if (!W.date) return renderWizard("Please choose a week.");
    }
    if (W.step === 3) {
      W.sessionId = document.getElementById("wizard-session").value;
      if (!W.sessionId)
        return renderWizard("Please select an available session.");
    }
    if (W.step === 4) {
      if (!document.getElementById("wizard-accept").checked)
        return renderWizard("Please acknowledge the demo before confirming.");
      const s = S.sessions.find((s) => s.id === W.sessionId),
        p = S.programs.find((p) => p.id === W.programId);
      if (!s || C.available(s) < W.childIds.length)
        return renderWizard(
          "This session no longer has enough space. Go back and choose another.",
        );
      if (
        W.childIds.some((id) => {
          const c = S.children.find((c) => c.id === id);
          return !c || c.age < p.ageMin || c.age > p.ageMax;
        })
      )
        return renderWizard(
          "A selected child is no longer eligible. Review your selection.",
        );
      if (
        W.childIds.some((id) =>
          S.enrollments.some(
            (e) =>
              e.childId === id &&
              e.sessionId === s.id &&
              e.status !== "Cancelled",
          ),
        )
      )
        return renderWizard(
          "A selected child is already enrolled in this session. Choose a different week.",
        );
      for (const childId of W.childIds)
        S.enrollments.push({
          id:
            "EN-" +
            Date.now().toString().slice(-7) +
            "-" +
            S.enrollments.length,
          childId,
          programId: p.id,
          sessionId: s.id,
          status: "Pending",
          paid: false,
          amount: p.price,
          created: new Date().toISOString().slice(0, 10),
        });
      S.notifications.push({
        id: "n" + Date.now(),
        title: "A new adventure is taking shape",
        body: `Your ${p.name} demo enrollment is pending. No real reservation was made.`,
        read: false,
      });
      C.save();
    }
    W.step++;
    renderWizard();
  }
  function closeNavigation(restoreFocus = true) {
    const nav = document.getElementById("public-nav");
    const wasOpen = nav?.classList.contains("is-open");
    nav?.classList.remove("is-open");
    nav?.removeAttribute("aria-modal");
    nav?.removeAttribute("role");
    nav?.setAttribute("aria-label", "Main navigation");
    document.body.classList.remove("navigation-open");
    document
      .querySelector('[data-action="menu"]')
      ?.setAttribute("aria-expanded", "false");
    document
      .querySelectorAll("#main,.site-footer")
      .forEach((el) => (el.inert = false));
    if (wasOpen && restoreFocus)
      document.querySelector('[data-action="menu"]')?.focus();
  }
  window
    .matchMedia("(min-width: 992px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeNavigation(false);
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      C.closeModal();
      closeNavigation();
      document
        .querySelectorAll("details[open]")
        .forEach((d) => (d.open = false));
      document.querySelector(".nav")?.classList.remove("is-open");
      document.querySelector(".sidebar")?.classList.remove("is-open");
      document
        .querySelectorAll("[data-action=menu],[data-action=sidebar]")
        .forEach((b) => b.setAttribute("aria-expanded", "false"));
    }
    const m =
      document.querySelector(".modal-panel") ||
      document.querySelector(".nav.is-open");
    if (m && e.key === "Tab") {
      const all = [
        ...m.querySelectorAll(
          "a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea",
        ),
      ].filter((el) => !el.hidden && el.getClientRects().length);
      if (e.shiftKey && document.activeElement === all[0]) {
        e.preventDefault();
        all.at(-1)?.focus();
      } else if (!e.shiftKey && document.activeElement === all.at(-1)) {
        e.preventDefault();
        all[0]?.focus();
      }
    }
  });
  document.addEventListener("click", async (e) => {
    const demo = e.target.closest("[data-demo]");
    if (demo) {
      sessionStorage.setItem("campora-role", demo.dataset.demo);
      location.href = C.link(demo.dataset.demo + "/index.html");
      return;
    }
    if (e.target.closest("[data-logout]")) {
      sessionStorage.removeItem("campora-role");
      localStorage.removeItem("campora-role");
    }
    const cat = e.target.closest("[data-category]");
    if (cat && cat.tagName !== "A") {
      document.querySelector("#program-filters [name=category]").value =
        cat.dataset.category;
      filterPrograms();
    }
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const id = b.dataset.id,
      S = C.state;
    switch (b.dataset.action) {
      case "close-menu":
        closeNavigation();
        break;
      case "hero-scene": {
        document.querySelectorAll("[data-hero-scene]").forEach((scene) => {
          const active = scene.dataset.heroScene === id;
          scene.classList.toggle("is-active", active);
          scene.setAttribute("aria-hidden", String(!active));
        });
        document
          .querySelectorAll('[data-action="hero-scene"]')
          .forEach((button) =>
            button.setAttribute(
              "aria-pressed",
              String(button.dataset.id === id),
            ),
          );
        break;
      }
      case "theme": {
        const theme =
          document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("campora-theme", theme);
        syncAppearanceControls();
        C.drawCharts?.();
        break;
      }
      case "rtl": {
        const dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
        document.documentElement.dir = dir;
        localStorage.setItem("campora-dir", dir);
        syncAppearanceControls();
        break;
      }
      case "menu":
        if (
          document.getElementById("public-nav")?.classList.contains("is-open")
        ) {
          closeNavigation();
          break;
        }
        {
          const nav = document.getElementById("public-nav");
          nav.classList.add("is-open");
          nav.setAttribute("role", "dialog");
          nav.setAttribute("aria-modal", "true");
          nav.setAttribute("aria-label", "Navigation");
          document.body.classList.add("navigation-open");
          b.setAttribute("aria-expanded", "true");
          document
            .querySelectorAll("#main,.site-footer")
            .forEach((el) => (el.inert = true));
          nav.querySelector(".drawer-close")?.focus();
        }
        break;
      case "sidebar": {
        const target = document.getElementById(b.getAttribute("aria-controls"));
        const open = target.classList.toggle("is-open");
        b.setAttribute("aria-expanded", String(open));
        break;
      }
      case "close-modal":
        C.closeModal();
        break;
      case "password": {
        const input = b.parentElement.querySelector("input");
        input.type = input.type === "password" ? "text" : "password";
        b.setAttribute(
          "aria-label",
          input.type === "password" ? "Show password" : "Hide password",
        );
        break;
      }
      case "share":
        try {
          await navigator.clipboard.writeText(location.href);
          C.toast("Article link copied.");
        } catch {
          C.modal(
            "Article link",
            `<label>Copy this URL<input readonly value="${E(location.href)}"></label>`,
          );
        }
        break;
      case "reset":
        C.modal(
          "Start fresh?",
          `<p>This removes your local demo changes and restores the fictional sample records.</p><div class="actions"><button class="btn btn-primary" data-action="reset-confirm">Reset demo data</button><button class="btn btn-secondary" data-action="close-modal">Keep my changes</button></div>`,
        );
        break;
      case "reset-confirm":
        localStorage.removeItem("campora-demo-v1");
        location.reload();
        break;
      case "child-add":
      case "child-edit": {
        const c = S.children.find((c) => c.id === id) || {};
        formModal(
          c.id ? "Edit child profile" : "Add a little adventurer",
          "child",
          id,
          field(
            "Child name",
            "name",
            c.name,
            "text",
            'required maxlength="80"',
          ) +
            field(
              "Age",
              "age",
              c.age || 7,
              "number",
              'min="4" max="16" required',
            ) +
            field(
              "Preferred activities",
              "interests",
              c.interests,
              "text",
              'maxlength="200"',
            ),
        );
        break;
      }
      case "child-delete":
        if (S.enrollments.some((e) => e.childId === id)) {
          C.toast(
            "This profile has enrollment history. Keep it to preserve accurate records.",
          );
        } else {
          C.modal(
            "Remove this profile?",
            `<p>The fictional child profile will be removed from this browser.</p><button class="btn btn-primary" data-action="child-delete-confirm" data-id="${E(id)}">Remove profile</button>`,
          );
        }
        break;
      case "child-delete-confirm":
        S.children = S.children.filter((c) => c.id !== id);
        saveRender();
        break;
      case "enroll":
        enroll(id);
        break;
      case "wizard-next":
        wizardNext();
        break;
      case "wizard-back":
        wizard.step--;
        renderWizard();
        break;
      case "cancel":
        C.modal(
          "Cancel this demo enrollment?",
          `<p>This releases the sample seat. If marked paid, the receipt remains as payment history; no actual refund is processed.</p><button class="btn btn-primary" data-action="cancel-confirm" data-id="${E(id)}">Cancel demo enrollment</button>`,
        );
        break;
      case "cancel-confirm": {
        const en = S.enrollments.find((e) => e.id === id);
        en.status = "Cancelled";
        saveRender();
        C.toast("Demo enrollment cancelled.");
        break;
      }
      case "enrollment-view": {
        const en = S.enrollments.find((e) => e.id === id),
          r = C.record(en);
        C.modal(
          "Their next little adventure",
          `<span class="badge">${E(en.id)} · ${E(en.status)}</span><h3 class="mt-4">${E(r.program)}</h3><p>${E(r.child)}<br>${r.session ? C.date(r.session.date) : "Archived session"} · ${E(r.session?.time)}<br>${C.money(en.amount)} · ${en.paid ? "Paid · Simulated" : "Unpaid · Demo"}</p>${C.role === "parent" ? C.btn("View payments", "parent/payments.html", "secondary") : ""}`,
        );
        break;
      }
      case "pay": {
        const en = S.enrollments.find((e) => e.id === id);
        C.modal(
          "A payment, purely for practice.",
          `<span class="badge">Simulation only</span><h3 class="mt-4">${C.money(en.amount)}</h3><p>${E(C.record(en).program)} · ${E(C.record(en).child)}</p><p>No card details are requested. No payment provider is contacted.</p><button class="btn btn-primary" data-action="pay-confirm" data-id="${E(id)}">Simulate successful payment</button>`,
        );
        break;
      }
      case "pay-confirm": {
        const en = S.enrollments.find((e) => e.id === id);
        if (en.status === "Cancelled" || en.paid) {
          C.toast("This record cannot be paid again.");
          break;
        }
        en.paid = true;
        en.paymentDate = new Date().toISOString().slice(0, 10);
        S.notifications.push({
          id: "n" + Date.now(),
          title: "Your demo receipt is ready",
          body: `Simulated payment saved for ${en.id}. No money was charged.`,
          read: false,
        });
        saveRender();
        C.toast("Simulated payment saved. Your receipt is ready.");
        break;
      }
      case "receipt-pdf":
        downloadReceipt(id);
        break;
      case "print":
        window.print();
        break;
      case "notification-read":
      case "message-read": {
        const list =
          b.dataset.action === "message-read" ? S.messages : S.notifications;
        const n = list.find((n) => n.id === id);
        n.read = !n.read;
        saveRender();
        break;
      }
      case "message-reply": {
        const m = S.messages.find((m) => m.id === id);
        formModal(
          "Save a local reply draft",
          "reply",
          id,
          `<p>No message is sent. This saves a draft in the demo inbox.</p><label>Draft reply<textarea name="reply" required maxlength="2000">${E(m.reply || "")}</textarea></label>`,
        );
        break;
      }
      case "program-add":
      case "program-edit": {
        const p = S.programs.find((p) => p.id === id) || {};
        formModal(
          p.id ? "Edit demo program" : "Add demo program",
          "program",
          id,
          field(
            "Program name",
            "name",
            p.name,
            "text",
            'required maxlength="100"',
          ) +
            `<label>Activity<select name="category">${options(
              ["Sports", "Arts", "Coding", "Swimming", "Nature"].map((c) => [
                c,
                c,
              ]),
              p.category,
            )}</select></label>` +
            field(
              "Minimum age",
              "ageMin",
              p.ageMin || 4,
              "number",
              'min="4" max="16" required',
            ) +
            field(
              "Maximum age",
              "ageMax",
              p.ageMax || 12,
              "number",
              'min="4" max="16" required',
            ) +
            field(
              "Weekly fee (USD)",
              "price",
              p.price || 185,
              "number",
              'min="1" max="10000" required',
            ) +
            field(
              "Default capacity",
              "capacity",
              p.capacity || 16,
              "number",
              'min="1" max="100" required',
            ) +
            `<label>Duration<select name="duration">${options(
              [
                ["Half day", "Half day"],
                ["Full day", "Full day"],
              ],
              p.duration,
            )}</select></label><label>Description<textarea name="description" required>${E(p.description || "")}</textarea></label>`,
        );
        break;
      }
      case "program-delete":
        if (S.enrollments.some((e) => e.programId === id)) {
          C.toast("This program has enrollment history and cannot be deleted.");
        } else
          C.modal(
            "Delete this program?",
            `<p>The program and its unbooked sessions will be removed from the local catalog.</p><button class="btn btn-primary" data-action="program-delete-confirm" data-id="${E(id)}">Delete demo program</button>`,
          );
        break;
      case "program-delete-confirm":
        S.programs = S.programs.filter((p) => p.id !== id);
        S.sessions = S.sessions.filter((s) => s.programId !== id);
        saveRender();
        break;
      case "session-edit": {
        const s = S.sessions.find((s) => s.id === id);
        formModal(
          "Edit weekly session",
          "session",
          id,
          field("Week starting (Monday)", "date", s.date, "date", "required") +
            field("Time slot", "time", s.time, "text", "required") +
            field(
              "Instructor",
              "instructor",
              s.instructor,
              "text",
              "required",
            ) +
            field(
              "Session capacity",
              "capacity",
              s.capacity,
              "number",
              'min="1" max="100" required',
            ),
        );
        break;
      }
    }
  });
  document.addEventListener("change", (e) => {
    const id = e.target.dataset.status;
    if (!id) return;
    const en = C.state.enrollments.find((e) => e.id === id),
      s = C.state.sessions.find((s) => s.id === en.sessionId);
    if (en.status === "Cancelled" && e.target.value !== "Cancelled") {
      if (
        !s ||
        C.available(s) < 1 ||
        C.state.enrollments.some(
          (other) =>
            other.id !== id &&
            other.childId === en.childId &&
            other.sessionId === en.sessionId &&
            other.status !== "Cancelled",
        )
      ) {
        C.toast("Cannot reactivate: session full or duplicate child booking.");
        e.target.value = en.status;
        return;
      }
    }
    en.status = e.target.value;
    C.save();
    C.toast("Demo status updated across both dashboards.");
  });
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (!f.dataset.form) return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f));
    const kind = f.dataset.form;
    const id = f.dataset.id;
    const S = C.state;
    const feedback = (text) => {
      f.querySelector(".form-feedback").textContent = text;
    };
    if (kind === "subscribe") {
      localStorage.setItem("campora-subscriber", data.email);
      feedback("Saved in this browser only. No email subscription was sent.");
      f.reset();
    }
    if (kind === "contact") {
      S.messages.push({ ...data, id: "m" + Date.now(), read: false });
      C.save();
      feedback(
        "Demo enquiry saved to the local admin inbox. No email was sent.",
      );
      f.reset();
    }
    if (kind === "forgot-password")
      feedback(
        "Demo only: no reset email was sent. Use either demo access button on the login page.",
      );
    if (kind === "register" || kind === "login") {
      if (kind === "register" && data.password !== data.confirm)
        return feedback("The passwords do not match.");
      if (kind === "register") {
        S.profile = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          relationship: data.relationship || "parent",
          ageGroup: data.ageGroup || "",
          experience: data.experience || "",
          interest: data.interest || "",
        };
        C.save();
      }
      sessionStorage.setItem("campora-role", "parent");
      if (data.remember) localStorage.setItem("campora-role", "parent");
      location.href = C.link("parent/index.html");
    }
    if (kind === "child") {
      const age = Number(data.age);
      if (
        id &&
        S.enrollments.some((en) => {
          const p = S.programs.find((p) => p.id === en.programId);
          return (
            en.childId === id &&
            en.status !== "Cancelled" &&
            p &&
            (age < p.ageMin || age > p.ageMax)
          );
        })
      ) {
        feedback(
          "This age is outside an active enrolled program’s range. Cancel that enrollment first.",
        );
        return;
      }
      const child = {
        id: id || "c" + Date.now(),
        name: data.name.trim(),
        age,
        interests: data.interests.trim(),
      };
      if (!child.name) return feedback("Please enter a name.");
      if (id)
        Object.assign(
          S.children.find((c) => c.id === id),
          child,
        );
      else S.children.push(child);
      saveRender();
      C.toast("Demo child profile saved.");
    }
    if (kind === "settings") {
      if (C.role === "admin") {
        S.camp = {
          name: data.name,
          email: data.email,
          notifications: !!data.notifications,
        };
      } else
        S.profile = { name: data.name, email: data.email, phone: data.phone };
      C.save();
      feedback("Demo settings saved in this browser.");
    }
    if (kind === "reply") {
      S.messages.find((m) => m.id === id).reply = data.reply;
      saveRender();
      C.toast("Local draft saved. No reply was sent.");
    }
    if (kind === "session") {
      const s = S.sessions.find((s) => s.id === id),
        used = s.capacity - C.available(s);
      if (Number(data.capacity) < used)
        return feedback(`Capacity cannot be below ${used} booked seats.`);
      if (new Date(data.date + "T12:00:00").getDay() !== 1)
        return feedback("Weekly camp sessions must begin on a Monday.");
      Object.assign(s, data, { capacity: Number(data.capacity) });
      saveRender();
    }
    if (kind === "program") {
      const min = +data.ageMin,
        max = +data.ageMax;
      if (min > max)
        return feedback(
          "Minimum age must be lower than or equal to maximum age.",
        );
      if (
        id &&
        S.enrollments.some((en) => {
          const child = S.children.find((c) => c.id === en.childId);
          return (
            en.programId === id &&
            en.status !== "Cancelled" &&
            child &&
            (child.age < min || child.age > max)
          );
        })
      ) {
        feedback(
          "The new age range would exclude an enrolled child. Review enrollments first.",
        );
        return;
      }
      const p = {
        ...data,
        id: id || "program-" + Date.now(),
        ageMin: min,
        ageMax: max,
        price: +data.price,
        capacity: +data.capacity,
      };
      if (id)
        Object.assign(
          S.programs.find((p) => p.id === id),
          p,
        );
      else {
        Object.assign(p, {
          image: data.category.toLowerCase() + ".webp",
          mentor: "Demo mentor",
          area: "Camp activity area",
          outcomes: [
            "Explore a new interest",
            "Practice teamwork",
            "Build growing confidence",
          ],
        });
        S.programs.push(p);
        S.sessions.push({
          id: p.id + "-1",
          programId: p.id,
          date: "2027-06-07",
          time: p.duration === "Half day" ? "09:00–12:00" : "09:00–16:00",
          capacity: p.capacity,
          instructor: p.mentor,
        });
      }
      saveRender();
    }
  });
  function filterPrograms() {
    const f = document.getElementById("program-filters");
    if (!f) return;
    const d = Object.fromEntries(new FormData(f));
    const list = C.state.programs.filter((p) => {
      const [min, max] = (d.age || "0-99").split("-").map(Number);
      return (
        p.name.toLowerCase().includes(d.search.toLowerCase()) &&
        (!d.category || p.category === d.category) &&
        p.ageMin <= max &&
        p.ageMax >= min &&
        (!d.price || p.price <= +d.price) &&
        (!d.date ||
          C.state.sessions.some(
            (s) => s.programId === p.id && s.date === d.date,
          ))
      );
    });
    document.getElementById("program-count").textContent =
      `${list.length} adventure${list.length === 1 ? "" : "s"} to discover · sample USD fees`;
    document.getElementById("program-results").innerHTML =
      list.map((p) => C.programCard(p)).join("") ||
      '<div class="empty-state"><h3>No adventures match just yet.</h3><p>Try another age group, activity, or budget. Reset filters to see every program.</p></div>';
    if (C.role === "parent")
      document
        .querySelectorAll('#program-results a[href*="?enroll="]')
        .forEach((a) => {
          const id = new URL(a.href).searchParams.get("enroll");
          a.href = "#main";
          a.dataset.action = "enroll";
          a.dataset.id = id;
          a.addEventListener("click", (e) => e.preventDefault());
        });
    document.querySelectorAll("[data-category]").forEach((b) => {
      const selected = b.dataset.category === d.category;
      if (b.tagName === "A") {
        if (selected) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
      } else b.setAttribute("aria-pressed", String(selected));
    });
    const url = new URL(location.href);
    for (const key of ["category", "age", "date", "price", "search"]) {
      if (d[key]) url.searchParams.set(key, d[key]);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
  }
  let blogLimit = 3;
  function filterBlog() {
    const f = document.getElementById("blog-filters");
    if (!f) return;
    const d = Object.fromEntries(new FormData(f));
    const list = C.state.posts.filter(
      (p) =>
        (p.title + " " + p.intro)
          .toLowerCase()
          .includes(d.search.toLowerCase()) &&
        (!d.category || p.category === d.category),
    );
    document.getElementById("blog-results").innerHTML =
      list.slice(0, blogLimit).map(C.postCard).join("") ||
      '<div class="empty-state">No matching stories. Try a different search.</div>';
    document.getElementById("blog-count").textContent =
      `Showing ${Math.min(blogLimit, list.length)} of ${list.length} stories`;
    document.getElementById("load-posts").hidden = blogLimit >= list.length;
    revealJournalStory();
  }
  function revealJournalStory() {
    if (!location.hash.startsWith("#story-")) return;
    const article = document.getElementById(location.hash.slice(1));
    const story = article?.querySelector(".journal-story");
    if (story) {
      story.open = true;
      article.scrollIntoView({ block: "start" });
    }
  }
  window.addEventListener("hashchange", revealJournalStory);
  function schedule() {
    const el = document.getElementById("schedule-app");
    if (!el) return;
    const family = el.dataset.family === "true";
    let week = 0,
      day = "All";
    const dates = ["2027-06-07", "2027-06-14", "2027-06-21"];
    el.innerHTML = `<div class="toolbar mb-4">${
      family
        ? `<label>Child<select id="schedule-child"><option value="">All children</option>${options(
            C.state.children.map((c) => [c.id, c.name]),
            "",
          )}</select></label>`
        : `<label>Age group<select id="schedule-age"><option value="">All ages</option>${options(
            [
              ["4-6", "4–6"],
              ["7-9", "7–9"],
              ["10-12", "10–12"],
              ["13-16", "13–16"],
            ],
            "",
          )}</select></label>`
    }<label>Activity<select id="schedule-category"><option value="">All activities</option>${options(
      ["Sports", "Arts", "Coding", "Swimming", "Nature"].map((x) => [x, x]),
      "",
    )}</select></label><div class="actions"><button class="icon-btn" id="week-prev" aria-label="Previous sample week"><i class='bi bi-chevron-left' aria-hidden='true'></i></button><span id="schedule-week" class="field"></span><button class="icon-btn" id="week-next" aria-label="Next sample week"><i class='bi bi-chevron-right' aria-hidden='true'></i></button></div></div><div class="day-tabs" role="tablist" aria-label="Weekday">${["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => `<button class="chip" role="tab" aria-selected="${d === "All"}" data-day="${d}">${d}</button>`).join("")}</div><div class="grid schedule-grid" id="schedule-days" role="tabpanel" aria-label="Selected weekday activities"></div>`;
    const render = () => {
      const category = el.querySelector("#schedule-category").value;
      const child = el.querySelector("#schedule-child")?.value;
      const age = el.querySelector("#schedule-age")?.value;
      const active = C.state.enrollments.filter(
        (e) =>
          e.status !== "Cancelled" &&
          (!child || e.childId === child) &&
          C.state.sessions.find((s) => s.id === e.sessionId)?.date ===
            dates[week],
      );
      const progs = C.state.programs.filter(
        (p) =>
          (!category || p.category === category) &&
          (!family || active.some((e) => e.programId === p.id)) &&
          (!age ||
            (() => {
              const [min, max] = age.split("-").map(Number);
              return p.ageMin <= max && p.ageMax >= min;
            })()),
      );
      el.querySelector("#schedule-week").textContent = C.date(dates[week]);
      el.querySelector("#week-prev").disabled = week === 0;
      el.querySelector("#week-next").disabled = week === 2;
      el.querySelector("#schedule-days").innerHTML = progs.length
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            .filter((d) => day === "All" || day === d)
            .map(
              (d, i) =>
                `<article class="schedule-day"><h3>${d}</h3>${progs.map((p) => `<div class="schedule-entry"><span>${p.duration === "Half day" ? "9 AM–12 PM" : "9 AM–4 PM"}</span><strong>${E(p.name)}</strong><p>${E(p.area)}<br>${E(p.mentor)} · ${family ? E(active.find((e) => e.programId === p.id)?.status || "Scheduled") : "Sample schedule"}</p></div>`).join("")}</article>`,
            )
            .join("")
        : '<div class="empty-state">No matching activities for this week. Choose another filter or add a demo enrollment.</div>';
      el.querySelectorAll("[data-day]").forEach((b) => {
        b.setAttribute("aria-selected", String(b.dataset.day === day));
        b.tabIndex = b.dataset.day === day ? 0 : -1;
        b.setAttribute("aria-controls", "schedule-days");
      });
    };
    el.addEventListener("change", render);
    el.querySelector("#week-prev").onclick = () => {
      week = Math.max(0, week - 1);
      render();
    };
    el.querySelector("#week-next").onclick = () => {
      week = Math.min(2, week + 1);
      render();
    };
    el.querySelectorAll("[data-day]").forEach(
      (b) =>
        (b.onclick = () => {
          day = b.dataset.day;
          render();
        }),
    );
    labelControls(el);
    el.querySelector('[role="tablist"]').addEventListener(
      "keydown",
      (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        const tabs = [...el.querySelectorAll("[data-day]")];
        let index = tabs.indexOf(document.activeElement);
        if (event.key === "Home") index = 0;
        else if (event.key === "End") index = tabs.length - 1;
        else
          index =
            (index +
              (event.key === "ArrowRight" ? 1 : -1) *
                (document.documentElement.dir === "rtl" ? -1 : 1) +
              tabs.length) %
            tabs.length;
        tabs[index].click();
        tabs[index].focus();
      },
    );
    render();
  }
  function downloadReceipt(id) {
    const e = C.state.enrollments.find((e) => e.id === id && e.paid);
    if (!e) return;
    if (!window.jspdf) {
      C.toast("PDF library could not load. Try reloading the page.");
      return;
    }
    const r = C.record(e),
      pdf = new jspdf.jsPDF();
    pdf.setFillColor(34, 52, 81);
    pdf.rect(0, 0, 210, 42, "F");
    pdf.setTextColor(255);
    pdf.setFontSize(26);
    pdf.text("campora.", 20, 26);
    pdf.setTextColor(34, 52, 81);
    pdf.setFontSize(19);
    pdf.text("Demo payment receipt", 20, 60);
    pdf.setFontSize(11);
    const rows = [
      ["Receipt", "RC-" + e.id],
      ["Payment date", C.date(e.paymentDate || e.created)],
      ["Parent", C.state.profile.name],
      ["Program", r.program],
      ["Child", r.child],
      ["Week starting", r.session ? C.date(r.session.date) : "Archived"],
      ["Session", r.session?.time || "Archived"],
      ["Weekly fee", C.money(e.amount)],
      ["Total", C.money(e.amount)],
      ["Status", "Paid - simulated"],
    ];
    let y = 80;
    for (const [label, value] of rows) {
      pdf.setFont("helvetica", "normal");
      pdf.text(label, 20, y);
      pdf.setFont("helvetica", "bold");
      const lines = pdf.splitTextToSize(
        String(value).replace(/[–—]/g, "-"),
        112,
      );
      pdf.text(lines, 78, y);
      y += Math.max(14, lines.length * 6 + 6);
    }
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 112, 132);
    pdf.text(
      pdf.splitTextToSize(
        "DEMONSTRATION ONLY. No real payment was processed. Generated locally by the Campora HTML template. All names and records are fictional.",
        170,
      ),
      20,
      y + 10,
    );
    pdf.save("Campora-RC-" + e.id + ".pdf");
    C.toast("Demo PDF receipt downloaded.");
  }
  C.downloadReceipt = downloadReceipt;
  document.addEventListener("input", (event) => {
    if (!event.target.matches('.access-form input[name="password"]')) return;
    const meter = document.querySelector(".auth-strength");
    if (!meter) return;
    const value = event.target.value;
    const score =
      value.length >= 12 &&
      /[a-z]/i.test(value) &&
      /\d/.test(value) &&
      /[^a-z\d]/i.test(value)
        ? 3
        : value.length >= 8 && /[a-z]/i.test(value) && /\d/.test(value)
          ? 2
          : value.length
            ? 1
            : 0;
    meter.dataset.strength = score;
    meter.querySelector("[data-password-strength]").textContent = [
      "Not set",
      "Keep going",
      "Good length & mix",
      "Strong mix",
    ][score];
  });
  document
    .querySelectorAll(".nav a")
    .forEach((anchor) =>
      anchor.addEventListener("click", () => closeNavigation(false)),
    );
  function labelControls(scope = document) {
    scope
      .querySelectorAll(
        "input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea",
      )
      .forEach((control) => {
        if (control.hasAttribute("placeholder")) return;
        const name = control.name.toLowerCase();
        const examples = {
          name: "e.g. Alex Morgan",
          email: "you@example.com",
          phone: "e.g. (555) 123-4567",
          subject: "What would you like to know?",
          body: "Tell us how we can help with your child’s summer…",
          password: "Enter a sample password (8+ characters)",
          confirm: "Re-enter your sample password",
          search: "Search by name or keyword…",
          message: "Write your message here…",
          description: "Describe the activity and what children will discover…",
        };
        const label = control
          .closest("label")
          ?.firstChild?.textContent.trim()
          .replace(/\s*\(optional\)/i, "");
        control.placeholder =
          examples[name] ||
          (control.tagName === "TEXTAREA"
            ? "Add a few helpful details…"
            : label
              ? "Enter " + label.toLowerCase()
              : "Enter a value");
      });
    scope.querySelectorAll("label").forEach((label) => {
      const control = label.querySelector(
        "input:not([type=checkbox]),select,textarea",
      );
      const text = label.firstChild?.textContent.trim();
      if (control && text && !control.hasAttribute("aria-label"))
        control.setAttribute("aria-label", text);
    });
  }
  function syncAppearanceControls() {
    const dark = document.documentElement.dataset.theme === "dark";
    const rtl = document.documentElement.dir === "rtl";
    document.querySelectorAll('[data-action="theme"]').forEach((button) => {
      const icon = button.querySelector("i");
      if (icon) icon.className = "bi bi-" + (dark ? "sun" : "moon-stars");
      button.title = "Switch to " + (dark ? "light" : "dark") + " mode";
      button.setAttribute("aria-pressed", String(dark));
      const label = button.querySelector("[data-theme-label]");
      if (label) label.textContent = dark ? "Light mode" : "Dark mode";
    });
    document.querySelectorAll('[data-action="rtl"]').forEach((button) => {
      button.setAttribute(
        "aria-label",
        "Switch to " + (rtl ? "LTR" : "RTL") + " layout",
      );
      button.title =
        "Switch to " + (rtl ? "left-to-right" : "right-to-left") + " layout";
      button.setAttribute("aria-pressed", String(rtl));
      const label = button.querySelector("[data-direction-label]");
      if (label) label.textContent = rtl ? "LTR" : "RTL";
      const icon = button.querySelector("i");
      if (icon) icon.className = "bi bi-text-" + (rtl ? "left" : "right");
    });
  }
  function initialize() {
    syncAppearanceControls();
    labelControls();
    document.querySelectorAll(".nav details").forEach((menu) => {
      if (menu.dataset.hoverReady) return;
      menu.dataset.hoverReady = "true";
      menu.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse" || innerWidth < 992) return;
        document.querySelectorAll(".nav details").forEach((other) => {
          if (other !== menu) other.open = false;
        });
        menu.open = true;
      });
      menu.addEventListener("pointerleave", (event) => {
        if (
          event.pointerType === "mouse" &&
          innerWidth >= 992 &&
          !menu.contains(document.activeElement)
        )
          menu.open = false;
      });
      menu.querySelectorAll("a").forEach((anchor) => {
        if (new URL(anchor.href).pathname === location.pathname) {
          anchor.classList.add("active");
          anchor.setAttribute("aria-current", "page");
          menu.querySelector("summary").classList.add("active");
        }
      });
    });
    const profileName = document.querySelector(".dash-topbar .profile-name");
    if (profileName && !profileName.closest("details")) {
      const avatar = profileName.previousElementSibling;
      const menu = document.createElement("details");
      menu.className = "profile-menu";
      const summary = document.createElement("summary");
      summary.setAttribute("aria-label", "Open profile menu");
      avatar.before(menu);
      menu.append(summary);
      summary.append(avatar, profileName);
      const links = document.createElement("div");
      links.className = "profile-menu__links";
      links.innerHTML =
        '<a href="settings.html">Profile & settings</a><a href="../index.html">Back to website</a><a href="../login.html" data-logout>Logout</a>';
      menu.append(links);
    }
    const f = document.getElementById("program-filters");
    if (f && !f.dataset.ready) {
      f.dataset.ready = "true";
      const q = new URLSearchParams(location.search);
      for (const key of ["category", "age", "date", "price", "search"])
        if (q.has(key)) f.elements[key].value = q.get(key);
      f.addEventListener("input", filterPrograms);
      f.addEventListener("change", filterPrograms);
      f.addEventListener("submit", (e) => e.preventDefault());
      f.addEventListener("reset", () => setTimeout(filterPrograms));
      filterPrograms();
    }
    const blog = document.getElementById("blog-filters");
    if (blog && !blog.dataset.ready) {
      blog.dataset.ready = "true";
      blog.addEventListener("input", () => {
        blogLimit = 3;
        filterBlog();
      });
      blog.addEventListener("submit", (e) => e.preventDefault());
      blog.addEventListener("reset", () => setTimeout(filterBlog));
      document.getElementById("load-posts").onclick = () => {
        blogLimit += 3;
        filterBlog();
      };
      filterBlog();
    }
    const ef = document.getElementById("enrollment-filters");
    if (ef && !ef.dataset.ready) {
      ef.dataset.ready = "true";
      const render = () => {
        const d = Object.fromEntries(new FormData(ef));
        document.getElementById("enrollment-results").innerHTML =
          C.enrollmentTable(
            C.state.enrollments.filter(
              (e) =>
                (!d.status || e.status === d.status) &&
                (!d.program || e.programId === d.program) &&
                (!d.date ||
                  C.state.sessions.find((s) => s.id === e.sessionId)?.date ===
                    d.date),
            ),
          );
      };
      ef.addEventListener("change", render);
      ef.addEventListener("submit", (e) => e.preventDefault());
      ef.addEventListener("reset", () => setTimeout(render));
    }
    const pf = document.getElementById("parent-filters");
    if (pf) {
      const render = () => {
        const d = Object.fromEntries(new FormData(pf));
        const p = C.state.profile;
        document.getElementById("parent-results").innerHTML = C.table(
          ["Parent", "Email", "Children", "Status"],
          (p.name + " " + p.email)
            .toLowerCase()
            .includes(d.search.toLowerCase())
            ? [[E(p.name), E(p.email), C.state.children.length, "Active"]]
            : [],
        );
      };
      pf.oninput = render;
      pf.onsubmit = (e) => e.preventDefault();
    }
    schedule();
    C.drawCharts?.();
  }
  document.addEventListener("campora:render", initialize);
  initialize();
  const programId = new URLSearchParams(location.search).get("enroll");
  if (C.role === "parent" && programId) enroll(programId);
  const countdown = document.getElementById("countdown");
  if (countdown) {
    const tick = () => {
      let diff = Math.max(
        0,
        new Date("2027-06-07T09:00:00-04:00") - Date.now(),
      );
      const units = [
        ["Days", Math.floor(diff / 86400000)],
        ["Hours", Math.floor(diff / 3600000) % 24],
        ["Minutes", Math.floor(diff / 60000) % 60],
        ["Seconds", Math.floor(diff / 1000) % 60],
      ];
      countdown.innerHTML = units
        .map(([n, v]) => `<div><strong>${v}</strong><span>${n}</span></div>`)
        .join("");
    };
    tick();
    setInterval(tick, 1000);
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav details"))
      document
        .querySelectorAll(".nav details[open]")
        .forEach((d) => (d.open = false));
    if (!e.target.closest('.sidebar,[data-action="sidebar"]')) {
      document.querySelector(".sidebar.is-open")?.classList.remove("is-open");
      document
        .querySelector('[data-action="sidebar"]')
        ?.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "campora-demo-v1") location.reload();
    if (event.key === "campora-theme") {
      document.documentElement.dataset.theme = event.newValue || "light";
      C.drawCharts?.();
    }
    if (event.key === "campora-dir")
      document.documentElement.dir = event.newValue || "ltr";
    syncAppearanceControls();
  });
})();
