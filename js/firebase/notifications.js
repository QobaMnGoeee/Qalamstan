function turanFormatOrderStatus(status) {
  const map = { new: "order_status_new", in_progress: "order_status_in_progress", done: "order_status_done" };
  return t(map[status] || "order_status_new");
}

function turanFormatDate(timestamp) {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString(turanCurrentLang === "kz" ? "kk-KZ" : turanCurrentLang === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function turanInitNotificationBell() {
  const bellBtn = document.getElementById("notifBellBtn");
  const badge = document.getElementById("notifBadge");

  if (!bellBtn) {
    return;
  }

  const isDashboardPage = window.location.pathname.indexOf("dashboard.html") !== -1;

  if (!isDashboardPage) {
    bellBtn.addEventListener("click", () => {
      const isRoot = !window.location.pathname.includes("/pages/");
      window.location.href = (isRoot ? "pages/" : "") + "dashboard.html";
    });
  }

  turanAuth.onAuthStateChanged((user) => {
    if (!user || typeof turanDb === "undefined") {
      if (badge) {
        badge.style.display = "none";
      }
      return;
    }

    try {
      let previousUnreadCount = null;

      turanDb.ref("notifications/" + user.uid).on("value", (snapshot) => {
        const data = snapshot.val() || {};
        const unreadCount = Object.values(data).filter((n) => !n.read).length;

        if (previousUnreadCount !== null && unreadCount > previousUnreadCount) {
          bellBtn.classList.remove("has-new");
          void bellBtn.offsetWidth;
          bellBtn.classList.add("has-new");
        }
        previousUnreadCount = unreadCount;

        if (badge) {
          if (unreadCount > 0) {
            badge.textContent = String(unreadCount > 9 ? "9+" : unreadCount);
            badge.style.display = "flex";
          } else {
            badge.style.display = "none";
          }
        }
      });
    } catch (error) {
      return;
    }
  });
}

function turanInitOrderAuthGate() {
  const gate = document.getElementById("orderLoginGate");
  const formWrap = document.getElementById("orderFormWrap");

  if (!gate || !formWrap) {
    return;
  }

  gate.style.display = "block";
  formWrap.style.display = "none";

  try {
    turanAuth.onAuthStateChanged((user) => {
      if (user) {
        gate.style.display = "none";
        formWrap.style.display = "block";
      } else {
        gate.style.display = "block";
        formWrap.style.display = "none";
      }
    });
  } catch (error) {
    return;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  turanInitNotificationBell();
  turanInitOrderAuthGate();
});
