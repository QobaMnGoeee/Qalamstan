let turanCurrentUser = null;

function turanShowFieldError(errEl, message) {
  if (!errEl) {
    return;
  }
  errEl.textContent = message;
  errEl.classList.add("show");
}

function turanClearFieldError(errEl) {
  if (!errEl) {
    return;
  }
  errEl.classList.remove("show");
  errEl.textContent = "";
}

function turanSetButtonLoading(btn, isLoading, idleText) {
  if (!btn) {
    return;
  }
  if (isLoading) {
    btn.dataset.idleText = btn.textContent;
    btn.innerHTML = '<div class="spinner-sm"></div>';
    btn.disabled = true;
  } else {
    btn.textContent = idleText || btn.dataset.idleText || btn.textContent;
    btn.disabled = false;
  }
}

async function turanDoRegister() {
  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const passInput = document.getElementById("regPass");
  const pass2Input = document.getElementById("regPass2");
  const errEl = document.getElementById("regErr");
  const btn = document.getElementById("regBtn");

  if (!nameInput || !emailInput || !passInput || !pass2Input) {
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value;
  const pass2 = pass2Input.value;

  turanClearFieldError(errEl);

  if (!name || !email || !pass || !pass2) {
    turanShowFieldError(errEl, t("err_fill"));
    return;
  }

  if (pass !== pass2) {
    turanShowFieldError(errEl, t("err_pass_match"));
    return;
  }

  if (pass.length < 6) {
    turanShowFieldError(errEl, t("err_pass_short"));
    return;
  }

  turanSetButtonLoading(btn, true);

  try {
    const cred = await turanAuth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await cred.user.sendEmailVerification();
    turanCurrentUser = turanAuth.currentUser;
    window.location.href = "../index.html";
  } catch (error) {
    turanShowFieldError(errEl, turanFirebaseErrorMessage(error));
    turanSetButtonLoading(btn, false, t("register_submit"));
  }
}

async function turanDoLogin() {
  const emailInput = document.getElementById("logEmail");
  const passInput = document.getElementById("logPass");
  const errEl = document.getElementById("logErr");
  const btn = document.getElementById("logBtn");

  if (!emailInput || !passInput) {
    return;
  }

  const email = emailInput.value.trim();
  const pass = passInput.value;

  turanClearFieldError(errEl);

  if (!email || !pass) {
    turanShowFieldError(errEl, t("err_fill"));
    return;
  }

  turanSetButtonLoading(btn, true);

  try {
    await turanAuth.signInWithEmailAndPassword(email, pass);
    window.location.href = "../index.html";
  } catch (error) {
    turanShowFieldError(errEl, turanFirebaseErrorMessage(error));
    turanSetButtonLoading(btn, false, t("login_submit"));
  }
}

async function turanDoGoogleAuth(errElId) {
  const provider = new firebase.auth.GoogleAuthProvider();
  const errEl = document.getElementById(errElId);

  try {
    await turanAuth.signInWithPopup(provider);
    window.location.href = "../index.html";
  } catch (error) {
    if (errEl) {
      const message = error.code === "auth/unauthorized-domain" ? t("err_domain") : turanFirebaseErrorMessage(error);
      turanShowFieldError(errEl, message);
    }
  }
}

async function turanDoLogout() {
  await turanAuth.signOut();
  window.location.href = "../index.html";
}

function turanFirebaseErrorMessage(error) {
  const knownCodes = {
    "auth/email-already-in-use": {
      ru: "Этот email уже зарегистрирован",
      kz: "Бұл email тіркелген",
      en: "This email is already registered"
    },
    "auth/invalid-email": {
      ru: "Некорректный email",
      kz: "Email форматы дұрыс емес",
      en: "Invalid email address"
    },
    "auth/user-not-found": {
      ru: "Пользователь не найден",
      kz: "Пайдаланушы табылмады",
      en: "User not found"
    },
    "auth/wrong-password": {
      ru: "Неверный пароль",
      kz: "Құпия сөз қате",
      en: "Incorrect password"
    },
    "auth/invalid-credential": {
      ru: "Неверный email или пароль",
      kz: "Email немесе құпия сөз қате",
      en: "Incorrect email or password"
    },
    "auth/too-many-requests": {
      ru: "Слишком много попыток. Попробуйте позже",
      kz: "Тым көп әрекет. Кейінірек көріңіз",
      en: "Too many attempts. Please try again later"
    }
  };

  if (error && error.code && knownCodes[error.code]) {
    return knownCodes[error.code][turanCurrentLang] || knownCodes[error.code].ru;
  }

  return t("err_generic");
}

function turanShowVerifyBanner() {
  if (!turanCurrentUser || turanCurrentUser.emailVerified) {
    return;
  }

  let banner = document.getElementById("verifyBanner");

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "verifyBanner";
    banner.className = "verify-banner";
    banner.setAttribute("data-visible", "false");
    banner.innerHTML = '<span data-t="verify_banner">' + t("verify_banner") + '</span><button type="button" id="verifyResendBtn" data-t="verify_resend">' + t("verify_resend") + "</button>";
    document.body.insertBefore(banner, document.body.firstChild.nextSibling);

    document.getElementById("verifyResendBtn").addEventListener("click", async (event) => {
      const btn = event.currentTarget;
      try {
        await turanCurrentUser.sendEmailVerification();
        btn.textContent = t("verify_sent");
        window.setTimeout(() => {
          btn.textContent = t("verify_resend");
        }, 4000);
      } catch (error) {
        return;
      }
    });

    window.setTimeout(() => {
      banner.setAttribute("data-visible", "true");
    }, 600);
  } else {
    banner.setAttribute("data-visible", "true");
  }
}

function turanHideVerifyBanner() {
  const banner = document.getElementById("verifyBanner");
  if (banner) {
    banner.setAttribute("data-visible", "false");
  }
}

function turanUpdateAuthNav() {
  const loggedOutEls = document.querySelectorAll("[data-auth-logged-out]");
  const loggedInEls = document.querySelectorAll("[data-auth-logged-in]");
  const nameEls = document.querySelectorAll("[data-auth-user-name]");

  if (turanCurrentUser) {
    loggedOutEls.forEach((el) => (el.style.display = "none"));
    loggedInEls.forEach((el) => (el.style.display = ""));
    nameEls.forEach((el) => {
      el.textContent = turanCurrentUser.displayName || turanCurrentUser.email;
    });
  } else {
    loggedOutEls.forEach((el) => (el.style.display = ""));
    loggedInEls.forEach((el) => (el.style.display = "none"));
  }
}

function turanInitAuthForms() {
  const regBtn = document.getElementById("regBtn");
  const logBtn = document.getElementById("logBtn");
  const regGoogleBtn = document.getElementById("regGoogleBtn");
  const logGoogleBtn = document.getElementById("logGoogleBtn");
  const logoutBtns = document.querySelectorAll("[data-logout-btn]");

  if (regBtn) {
    regBtn.addEventListener("click", turanDoRegister);
  }

  if (logBtn) {
    logBtn.addEventListener("click", turanDoLogin);
  }

  if (regGoogleBtn) {
    regGoogleBtn.addEventListener("click", () => turanDoGoogleAuth("regErr"));
  }

  if (logGoogleBtn) {
    logGoogleBtn.addEventListener("click", () => turanDoGoogleAuth("logErr"));
  }

  logoutBtns.forEach((btn) => btn.addEventListener("click", turanDoLogout));

  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    const targetId = btn.getAttribute("data-toggle-password");
    const input = document.getElementById(targetId);

    if (!input) {
      return;
    }

    btn.addEventListener("click", () => {
      const isHidden = input.getAttribute("type") === "password";
      input.setAttribute("type", isHidden ? "text" : "password");
    });
  });

  ["regName", "regEmail", "regPass", "regPass2", "logEmail", "logPass"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) {
      return;
    }
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (id.startsWith("reg")) {
          turanDoRegister();
        } else {
          turanDoLogin();
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  turanInitAuthForms();

  turanAuth.onAuthStateChanged((user) => {
    turanCurrentUser = user;
    turanUpdateAuthNav();

    if (user && !user.emailVerified && !user.providerData.some((p) => p.providerId === "google.com")) {
      turanShowVerifyBanner();
    } else {
      turanHideVerifyBanner();
    }
  });
});
