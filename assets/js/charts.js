(() => {
  const C = Campora;
  let charts = [];
  C.drawCharts = () => {
    charts.forEach((c) => c.destroy());
    charts = [];
    if (!window.Chart) return;
    const S = C.state,
      active = S.enrollments.filter((e) => e.status !== "Cancelled");
    const style = getComputedStyle(document.documentElement),
      text = style.getPropertyValue("--muted").trim(),
      grid = style.getPropertyValue("--border").trim();
    const colors = ["#e87965", "#8fbed8", "#e9b85b", "#9394b6", "#93aaa4"];
    const draw = (id, type, labels, values, extra = {}) => {
      const el = document.getElementById(id);
      if (!el) return;
      const summary = labels.map((l, i) => l + ": " + values[i]).join(", ");
      el.setAttribute("aria-label", summary);
      const sr = document.getElementById(id + "-summary");
      if (sr) sr.textContent = summary;
      el.parentElement.querySelector(".chart-empty")?.remove();
      el.hidden = values.every((value) => value === 0);
      if (el.hidden) {
        const empty = document.createElement("div");
        empty.className = "empty-state chart-empty";
        empty.textContent = "No matching demo records yet.";
        el.parentElement.append(empty);
        return;
      }
      charts.push(
        new Chart(el, {
          type,
          data: {
            labels,
            datasets: [
              {
                label: id === "revenue-chart" ? "USD" : "Records",
                data: values,
                backgroundColor: type === "line" ? "#e8796522" : colors,
                borderColor:
                  type === "line"
                    ? "#e87965"
                    : style.getPropertyValue("--card").trim(),
                borderWidth: type === "doughnut" ? 3 : 2,
                borderRadius: type === "bar" ? 5 : 0,
                tension: 0.35,
                fill: type === "line",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                display: type === "doughnut",
                position: "bottom",
                labels: {
                  color: text,
                  boxWidth: 10,
                  padding: 16,
                  font: { size: 11 },
                },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.label}: ${id === "revenue-chart" ? C.money(ctx.raw) : ctx.raw}`,
                },
              },
            },
            scales:
              type === "doughnut"
                ? {}
                : {
                    x: {
                      ticks: { color: text, font: { size: 10 } },
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: text, precision: 0, font: { size: 10 } },
                      grid: { color: grid },
                    },
                  },
            ...extra,
          },
        }),
      );
    };
    const categories = ["Sports", "Arts", "Coding", "Swimming", "Nature"];
    draw(
      "activity-chart",
      "doughnut",
      categories,
      categories.map(
        (cat) =>
          active.filter(
            (e) =>
              S.programs.find((p) => p.id === e.programId)?.category === cat,
          ).length,
      ),
      { cutout: "70%" },
    );
    if (C.role === "admin") {
      const months = [
        ...new Set(S.enrollments.map((e) => e.created.slice(0, 7))),
      ].sort();
      draw(
        "weekly-chart",
        "line",
        months.length ? months : ["No records"],
        months.length
          ? months.map(
              (m) =>
                S.enrollments.filter((e) => e.created.startsWith(m)).length,
            )
          : [0],
      );
      draw(
        "revenue-chart",
        "bar",
        months.length ? months : ["No payments"],
        months.length
          ? months.map((m) =>
              S.enrollments
                .filter((e) => e.paid && e.created.startsWith(m))
                .reduce((n, e) => n + e.amount, 0),
            )
          : [0],
      );
    } else {
      draw(
        "weekly-chart",
        "bar",
        ["Mon", "Tue", "Wed", "Thu", "Fri"],
        Array(5).fill(active.length),
      );
      draw(
        "revenue-chart",
        "bar",
        S.programs.map((p) => p.category),
        S.programs.map((p) =>
          active
            .filter((e) => e.programId === p.id)
            .reduce((n, e) => n + e.amount, 0),
        ),
      );
    }
    const statuses = ["Confirmed", "Pending", "Waitlisted", "Cancelled"];
    draw(
      "status-chart",
      "bar",
      statuses,
      statuses.map((s) => S.enrollments.filter((e) => e.status === s).length),
    );
    const used = S.sessions.filter((s) =>
      S.enrollments.some((e) => e.sessionId === s.id),
    );
    draw(
      "occupancy-chart",
      "bar",
      used.length
        ? used.map(
            (s) =>
              S.programs.find((p) => p.id === s.programId)?.category +
              " " +
              s.date.slice(5),
          )
        : ["No booked sessions"],
      used.length ? used.map((s) => s.capacity - C.available(s)) : [0],
      { indexAxis: "y" },
    );
    const groups = [
      [4, 6],
      [7, 9],
      [10, 12],
      [13, 16],
    ];
    draw(
      "age-chart",
      "doughnut",
      groups.map(([a, b]) => `${a}–${b}`),
      groups.map(
        ([a, b]) =>
          active.filter((e) => {
            const age = S.children.find((c) => c.id === e.childId)?.age;
            return age >= a && age <= b;
          }).length,
      ),
      { cutout: "70%" },
    );
  };
})();
