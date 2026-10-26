(() => {
  let theme;
  try {
    theme = localStorage.getItem("campora-theme");
  } catch {}
  document.documentElement.dataset.theme =
    theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  try {
    document.documentElement.dir = localStorage.getItem("campora-dir") || "ltr";
  } catch {}
})();
