const TURAN_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1526338225491411130/XJ0Ynl26V8NoLInSma3gpg34bI4Y3JAPiZXWhuotUWfF6bar1DtVa-uAdJoaf6qe-76J";

const TURAN_SERVICE_LABELS = {
  plugin: { ru: "Разработка плагина", kz: "Плагин жасау", en: "Plugin development" },
  server: { ru: "Сборка сервера", kz: "Сервер сборка", en: "Server setup" },
  map: { ru: "Дизайн карты", kz: "Карта дизайны", en: "Map design" },
  design: { ru: "Визуальный дизайн", kz: "Визуал дизайн", en: "Visual design" },
  other: { ru: "Другое", kz: "Басқа", en: "Other" }
};

function turanServiceLabel(serviceValue) {
  const entry = TURAN_SERVICE_LABELS[serviceValue];
  if (!entry) {
    return serviceValue;
  }
  return entry[turanCurrentLang] || entry.ru;
}

function turanEscapeForDiscord(value) {
  return String(value).replace(/[\\`*_~|]/g, (match) => "\\" + match);
}

async function turanSendOrderToDiscord(order) {
  const embed = {
    title: "Поступил новый заказ!",
    color: 14024668,
    fields: [
      { name: "Имя", value: turanEscapeForDiscord(order.name) || "—", inline: true },
      { name: "Контакт", value: turanEscapeForDiscord(order.contact) || "—", inline: true },
      { name: "Тип услуги", value: turanEscapeForDiscord(turanServiceLabel(order.service)) || "—", inline: true },
      { name: "Бюджет", value: turanEscapeForDiscord(order.budget) || "—", inline: true },
      { name: "Желаемый срок", value: turanEscapeForDiscord(order.deadline) || "—", inline: true },
      { name: "Язык заявки", value: turanCurrentLang.toUpperCase(), inline: true },
      { name: "Описание проекта", value: turanEscapeForDiscord(order.description) || "—", inline: false }
    ],
    footer: { text: "TURAN STUDIO · Заявка с сайта" },
    timestamp: new Date().toISOString()
  };

  const payload = {
    content: "@everyone",
    embeds: [embed],
    allowed_mentions: { parse: ["everyone"] }
  };

  const response = await fetch(TURAN_DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Discord webhook request failed with status " + response.status);
  }
}

function turanReadOrderForm() {
  return {
    name: document.getElementById("orderName").value.trim(),
    contact: document.getElementById("orderContact").value.trim(),
    service: document.getElementById("orderService").value,
    budget: document.getElementById("orderBudget").value.trim(),
    deadline: document.getElementById("orderDeadline").value.trim(),
    description: document.getElementById("orderDescription").value.trim()
  };
}

async function turanHandleOrderSubmit(event) {
  event.preventDefault();

  const errEl = document.getElementById("orderErr");
  const successEl = document.getElementById("orderSuccess");
  const btn = document.getElementById("orderSubmitBtn");

  turanClearFieldError(errEl);
  if (successEl) {
    successEl.classList.remove("show");
  }

  const order = turanReadOrderForm();

  if (!order.name || !order.contact || !order.service || !order.description) {
    turanShowFieldError(errEl, t("err_order_required"));
    return;
  }

  const idleLabel = btn.textContent;
  turanSetButtonLoading(btn, true);

  try {
    await turanSendOrderToDiscord(order);

    turanTryLogOrderToFirebase(order);

    document.getElementById("orderForm").reset();

    if (successEl) {
      successEl.classList.add("show");
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    turanSetButtonLoading(btn, false, idleLabel);
  } catch (error) {
    turanShowFieldError(errEl, t("err_generic"));
    turanSetButtonLoading(btn, false, idleLabel);
  }
}

function turanTryLogOrderToFirebase(order) {
  try {
    if (typeof turanDb === "undefined" || !turanDb) {
      return;
    }

    turanDb.ref("orders").push({
      ...order,
      lang: turanCurrentLang,
      userId: typeof turanCurrentUser !== "undefined" && turanCurrentUser ? turanCurrentUser.uid : null,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  } catch (dbError) {
    return;
  }
}

function turanInitOrderForm() {
  const form = document.getElementById("orderForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", turanHandleOrderSubmit);
}

document.addEventListener("DOMContentLoaded", turanInitOrderForm);
