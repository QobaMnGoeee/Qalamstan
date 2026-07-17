function turanInitFaqAccordion() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    const answer = btn.nextElementSibling;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question").forEach((otherBtn) => {
        otherBtn.setAttribute("aria-expanded", "false");
        otherBtn.nextElementSibling.style.maxHeight = "";
      });

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", turanInitFaqAccordion);
