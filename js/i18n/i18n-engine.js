const TURAN_LANG_STORAGE_KEY = "turan-studio-lang";

let turanCurrentLang = TURAN_DEFAULT_LANG;

function turanGetStoredLang() {
  try {
    const stored = window.localStorage.getItem(TURAN_LANG_STORAGE_KEY);
    if (stored && TURAN_SUPPORTED_LANGS.indexOf(stored) !== -1) {
      return stored;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function turanStoreLang(lang) {
  try {
    window.localStorage.setItem(TURAN_LANG_STORAGE_KEY, lang);
  } catch (error) {
    return;
  }
}

function t(key) {
  const dict = TURAN_TRANSLATIONS[turanCurrentLang] || TURAN_TRANSLATIONS[TURAN_DEFAULT_LANG];
  return dict[key] || TURAN_TRANSLATIONS[TURAN_DEFAULT_LANG][key] || key;
}

function turanApplyLang(lang) {
  if (TURAN_SUPPORTED_LANGS.indexOf(lang) === -1) {
    lang = TURAN_DEFAULT_LANG;
  }

  turanCurrentLang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.setAttribute("lang", lang === "kz" ? "kk" : lang);

  document.querySelectorAll("[data-t]").forEach((el) => {
    const key = el.getAttribute("data-t");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-tp]").forEach((el) => {
    const key = el.getAttribute("data-tp");
    el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-t-html]").forEach((el) => {
    const key = el.getAttribute("data-t-html");
    el.innerHTML = t(key);
  });

  turanUpdateLangSwitchUI();
  turanStoreLang(lang);
}

function turanUpdateLangSwitchUI() {
  document.querySelectorAll("[data-lang-current-label]").forEach((el) => {
    el.textContent = TURAN_LANG_LABELS[turanCurrentLang];
  });

  document.querySelectorAll(".lang-switch-option").forEach((el) => {
    const optionLang = el.getAttribute("data-lang-option");
    el.setAttribute("aria-selected", optionLang === turanCurrentLang ? "true" : "false");
  });
}

function turanInitLangSwitch() {
  const triggers = document.querySelectorAll("[data-lang-trigger]");

  triggers.forEach((trigger) => {
    const menu = trigger.parentElement.querySelector(".lang-switch-menu");

    if (!menu) {
      return;
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menu.getAttribute("data-open") === "true";
      document.querySelectorAll(".lang-switch-menu").forEach((m) => m.setAttribute("data-open", "false"));
      document.querySelectorAll("[data-lang-trigger]").forEach((tr) => tr.setAttribute("aria-expanded", "false"));

      if (!isOpen) {
        menu.setAttribute("data-open", "true");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    menu.querySelectorAll(".lang-switch-option").forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.getAttribute("data-lang-option");
        turanApplyLang(lang);
        menu.setAttribute("data-open", "false");
        trigger.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".lang-switch-menu").forEach((m) => m.setAttribute("data-open", "false"));
    document.querySelectorAll("[data-lang-trigger]").forEach((tr) => tr.setAttribute("aria-expanded", "false"));
  });
}

function turanInitI18n() {
  const initialLang = turanGetStoredLang() || TURAN_DEFAULT_LANG;
  turanInitLangSwitch();
  turanApplyLang(initialLang);
}

document.addEventListener("DOMContentLoaded", turanInitI18n);
