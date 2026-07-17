function turanRenderOrderCard(order) {
  const status = order.status || "new";
  const serviceLabel = turanServiceLabel(order.service);
  const dateStr = turanFormatDate(order.createdAt);

  const card = document.createElement("div");
  card.className = "order-card";
  card.innerHTML =
    '<div class="order-card-top">' +
    '<span class="order-card-service"></span>' +
    '<span class="order-status-pill status-' + status + '"></span>' +
    "</div>" +
    '<p class="order-card-desc"></p>' +
    '<div class="order-card-date"></div>';

  card.querySelector(".order-card-service").textContent = serviceLabel;
  card.querySelector(".order-status-pill").textContent = turanFormatOrderStatus(status);
  card.querySelector(".order-card-desc").textContent = order.description || "";
  card.querySelector(".order-card-date").textContent = dateStr;

  return card;
}

function turanRenderNotifCard(notif, notifId, uid) {
  const card = document.createElement("div");
  card.className = "notif-card" + (notif.read ? "" : " unread");
  card.innerHTML =
    '<div class="notif-card-from" data-t="notif_from_admin">От команды TURAN STUDIO</div>' +
    '<div class="notif-card-text"></div>' +
    '<div class="notif-card-date"></div>';

  card.querySelector(".notif-card-text").textContent = notif.message || "";
  card.querySelector(".notif-card-date").textContent = turanFormatDate(notif.createdAt);

  if (!notif.read) {
    card.addEventListener(
      "click",
      () => {
        try {
          turanDb.ref("notifications/" + uid + "/" + notifId + "/read").set(true);
        } catch (error) {
          return;
        }
      },
      { once: true }
    );
  }

  return card;
}

function turanLoadDashboard(uid) {
  const ordersList = document.getElementById("ordersList");
  const ordersEmpty = document.getElementById("ordersEmpty");
  const notifList = document.getElementById("notificationsList");
  const notifEmpty = document.getElementById("notifEmpty");

  if (!ordersList || typeof turanDb === "undefined") {
    return;
  }

  try {
    turanDb
      .ref("orders")
      .orderByChild("userId")
      .equalTo(uid)
      .on("value", (snapshot) => {
        const data = snapshot.val() || {};
        const entries = Object.values(data).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        ordersList.innerHTML = "";

        if (entries.length === 0) {
          ordersEmpty.style.display = "block";
        } else {
          ordersEmpty.style.display = "none";
          entries.forEach((order) => {
            ordersList.appendChild(turanRenderOrderCard(order));
          });
        }
      });
  } catch (error) {
    ordersEmpty.style.display = "block";
  }

  try {
    turanDb
      .ref("notifications/" + uid)
      .on("value", (snapshot) => {
        const data = snapshot.val() || {};
        const ids = Object.keys(data).sort((a, b) => (data[b].createdAt || 0) - (data[a].createdAt || 0));

        notifList.innerHTML = "";

        if (ids.length === 0) {
          notifEmpty.style.display = "block";
        } else {
          notifEmpty.style.display = "none";
          ids.forEach((id) => {
            notifList.appendChild(turanRenderNotifCard(data[id], id, uid));
          });
        }
      });
  } catch (error) {
    notifEmpty.style.display = "block";
  }
}

function turanInitDashboardPage() {
  const loginRequired = document.getElementById("dashboardLoginRequired");
  const content = document.getElementById("dashboardContent");

  if (!loginRequired || !content) {
    return;
  }

  loginRequired.style.display = "block";
  content.style.display = "none";

  try {
    turanAuth.onAuthStateChanged((user) => {
      if (user) {
        loginRequired.style.display = "none";
        content.style.display = "block";
        turanLoadDashboard(user.uid);
      } else {
        loginRequired.style.display = "block";
        content.style.display = "none";
      }
    });
  } catch (error) {
    return;
  }

  const bellBtn = document.getElementById("notifBellBtn");
  if (bellBtn) {
    bellBtn.addEventListener("click", () => {
      const anchor = document.getElementById("notificationsAnchor");
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", turanInitDashboardPage);
