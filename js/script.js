function initNavbarToggle() {
  const toggle = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".navbar-links");

  if (!toggle || !links) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    links.setAttribute("data-open", String(!isOpen));
    document.body.style.overflow = isOpen ? "" : "hidden";
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      links.setAttribute("data-open", "false");
      document.body.style.overflow = "";
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1023) {
      toggle.setAttribute("aria-expanded", "false");
      links.setAttribute("data-open", "false");
      document.body.style.overflow = "";
    }
  });
}

function initFooterYear() {
  const yearEl = document.querySelector("[data-current-year]");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initFooterYear();
});
