(() => {
  "use strict";

  const menus = [...document.querySelectorAll("details.language-switcher")];

  document.addEventListener("click", (event) => {
    for (const menu of menus) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const menu of menus) {
      if (!menu.open) continue;
      const focusInside = menu.contains(document.activeElement);
      menu.open = false;
      if (focusInside) menu.querySelector("summary")?.focus();
    }
  });
})();
