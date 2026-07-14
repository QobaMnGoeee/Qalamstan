const COOKIE_CONSENT_STORAGE_KEY = "turan-studio-cookie-consent";

function hasStoredCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted";
  } catch (error) {
    return false;
  }
}

function storeCookieConsent() {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
  } catch (error) {
    return;
  }
}

function initCookieConsent() {
  const banner = document.querySelector("[data-cookie-banner]");

  if (!banner) {
    return;
  }

  if (hasStoredCookieConsent()) {
    banner.remove();
    return;
  }

  window.setTimeout(() => {
    banner.setAttribute("data-visible", "true");
  }, 600);

  const acceptButton = banner.querySelector("[data-cookie-accept]");

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      storeCookieConsent();
      banner.setAttribute("data-visible", "false");
      window.setTimeout(() => {
        banner.remove();
      }, 500);
    });
  }
}

document.addEventListener("DOMContentLoaded", initCookieConsent);
