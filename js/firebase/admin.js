let turanAllOrders = {};
let turanAdminFilter = "all";

function turanRenderAdminOrderRow(orderId, order) {
  const row = document.createElement("div");
  row.className = "admin-order-row";

  const statusOptions = ["new", "in_progress", "done"]
    .map((s) => '<option value="' + s + '"' + (order.status === s || (!order.status && s === "new") ? " selected" : "") + ">" + turanFormatOrderStatus(s) + "</option>")
    .join("");

  row.innerHTML =
    '<div class="admin-order-row-top">' +
    "<div>" +
    '<div class="admin-order-field"><strong>' + turanEscapeHtml(order.name || "—") + "</strong></div>" +
    '<div class="admin-order-meta"></div>' +
    "</div>" +
    '<select class="admin-status-select" data-order-id="' + orderId + '">' + statusOptions + "</select>" +
    "</div>" +
    '<div class="admin-order-field">Контакт: <strong>' + turanEscapeHtml(order.contact || "—") + "</strong></div>" +
    '<div class="admin-order-field">Услуга: <strong>' + turanEscapeHtml(turanServiceLabel(order.service)) + "</strong></div>" +
    '<div class="admin-order-field">Бюджет: <strong>' + turanEscapeHtml(order.budget || "—") + '</strong> · Срок: <strong>' + turanEscapeHtml(order.deadline || "—") + "</strong></div>" +
    '<div class="admin-order-field" style="margin-top:8px">' + turanEscapeHtml(order.description || "") + "</div>";

  row.querySelector(".admin-order-meta").textContent = turanFormatDate(order.createdAt);

  row.querySelector(".admin-status-select").addEventListener("change", (event) => {
    const newStatus = event.target.value;
    try {
      turanDb.ref("orders/" + orderId + "/status").set(newStatus);
    } catch (error) {
      return;
    }
  });

  return row;
}

function turanEscapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function turanRenderAdminOrders() {
  const list = document.getElementById("adminOrdersList");
  const empty = document.getElementById("adminOrdersEmpty");

  if (!list) {
    return;
  }

  const entries = Object.entries(turanAllOrders)
    .filter(([id, order]) => turanAdminFilter === "all" || (order.status || "new") === turanAdminFilter)
    .sort((a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0));

  list.innerHTML = "";

  if (entries.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    entries.forEach(([id, order]) => {
      list.appendChild(turanRenderAdminOrderRow(id, order));
    });
  }
}

function turanPopulateAdminUserSelect() {
  const select = document.getElementById("adminUserSelect");

  if (!select) {
    return;
  }

  const entries = Object.entries(turanAllOrders).sort((a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0));

  select.innerHTML = entries
    .filter(([id, order]) => order.userId)
    .map(([id, order]) => {
      const label = (order.name || "—") + " · " + turanServiceLabel(order.service) + " · " + turanFormatDate(order.createdAt);
      return '<option value="' + order.userId + '">' + turanEscapeHtml(label) + "</option>";
    })
    .join("");
}

function turanInitAdminFilters() {
  document.querySelectorAll("[data-admin-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      turanAdminFilter = chip.getAttribute("data-admin-filter");
      turanRenderAdminOrders();
    });
  });
}

function turanInitAdminSendNotification() {
  const btn = document.getElementById("adminSendNotifBtn");
  const select = document.getElementById("adminUserSelect");
  const textarea = document.getElementById("adminMessageText");
  const errEl = document.getElementById("adminNotifErr");
  const sentEl = document.getElementById("adminNotifSent");

  if (!btn) {
    return;
  }

  btn.addEventListener("click", async () => {
    turanClearFieldError(errEl);
    sentEl.classList.remove("show");

    const uid = select.value;
    const message = textarea.value.trim();

    if (!uid || !message) {
      turanShowFieldError(errEl, "Выберите заявку и введите сообщение");
      return;
    }

    try {
      await turanDb.ref("notifications/" + uid).push({
        message: message,
        read: false,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });
      textarea.value = "";
      sentEl.classList.add("show");
    } catch (error) {
      turanShowFieldError(errEl, "Не удалось отправить. Проверьте права доступа.");
    }
  });
}

function turanLoadAllOrdersForAdmin() {
  try {
    turanDb.ref("orders").on("value", (snapshot) => {
      turanAllOrders = snapshot.val() || {};
      turanRenderAdminOrders();
      turanPopulateAdminUserSelect();
    });
  } catch (error) {
    return;
  }
}

function turanInitAdminPage() {
  const noAccess = document.getElementById("adminNoAccess");
  const content = document.getElementById("adminContent");

  if (!noAccess || !content) {
    return;
  }

  turanInitAdminFilters();
  turanInitAdminSendNotification();

  noAccess.style.display = "block";
  content.style.display = "none";

  try {
    turanAuth.onAuthStateChanged((user) => {
      if (!user || typeof turanDb === "undefined") {
        noAccess.style.display = "block";
        content.style.display = "none";
        return;
      }

      turanDb
        .ref("admins/" + user.uid)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val() === true) {
            noAccess.style.display = "none";
            content.style.display = "block";
            turanLoadAllOrdersForAdmin();
          } else {
            noAccess.style.display = "block";
            content.style.display = "none";
          }
        })
        .catch(() => {
          noAccess.style.display = "block";
          content.style.display = "none";
        });
    });
  } catch (error) {
    return;
  }
}

document.addEventListener("DOMContentLoaded", turanInitAdminPage);
