import { type Submission } from "./store.js";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const TYPE_METADATA: Record<Submission["type"], { emoji: string; title: string }> = {
  contact: { emoji: "📩", title: "НОВОЕ УВЕДОМЛЕНИЕ С САЙТА" },
  partners: { emoji: "🤝", title: "ЗАЯВКА ОТ ПАРТНЁРА" },
};

const FIELD_LABELS: Record<string, string> = {
  name: "Имя",
  contact: "Контакт",
  company: "Компания",
  phone: "Телефон",
  email: "Email",
  eventtype: "Тип мероприятия",
  date: "Дата мероприятия",
  guests: "Кол-во гостей",
  channels: "Выбрано",
  channels_phone: "  ↳ Телефон",
  channels_whatsapp: "  ↳ WhatsApp",
  channels_telegram: "  ↳ Telegram",
  channels_instagram: "  ↳ Instagram",
  channels_threads: "  ↳ Threads",
  channels_email: "  ↳ Email",
  format: "Формат мероприятия",
  budget: "Бюджет",
  message: "Сообщение",
  comment: "Комментарий",
  service: "Услуга",
  locale: "Язык заявки",
};

const FIELD_GROUPS: { title: string; keys: string[] }[] = [
  { title: "👤 Контакт", keys: ["name", "company", "contact", "phone", "email", "locale"] },
  { title: "🎉 Мероприятие", keys: ["eventtype", "format", "service", "date", "guests", "budget"] },
  { title: "📲 Способ связи", keys: ["channels", "channels_phone", "channels_whatsapp", "channels_telegram", "channels_instagram", "channels_threads", "channels_email"] },
  { title: "📝 Сообщение", keys: ["message", "comment"] },
];

export async function sendTelegramNotification(entry: Submission): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const topicId = process.env.TELEGRAM_TOPIC_ID;

  if (!token || !chatId) {
    console.log("[Telegram] BOT_TOKEN or CHAT_ID not set. Skipping Telegram notification.");
    return false;
  }

  const meta = TYPE_METADATA[entry.type] || { emoji: "📩", title: "НОВАЯ ЗАЯВКА" };
  const dateFormatted = new Date(entry.receivedAt).toLocaleString("ru-RU", {
    timeZone: "Europe/Bratislava",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  let message = `${meta.emoji} <b>${meta.title}</b>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🆔 ID: <code>${entry.id}</code>\n`;
  message += `🕐 ${dateFormatted} (Bratislava)\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━`;

  const data: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(entry.data)) {
    if (rawValue) data[key.toLowerCase()] = String(rawValue);
  }

  const groupedKeys = new Set(FIELD_GROUPS.flatMap((g) => g.keys));
  const leftoverKeys = Object.keys(data).filter((key) => !groupedKeys.has(key));

  for (const group of FIELD_GROUPS) {
    const lines = group.keys
      .filter((key) => data[key])
      .map((key) => {
        const val = escapeHtml(data[key]);
        if (key === "message") return val;
        const label = FIELD_LABELS[key] || key;
        return `<b>${label}:</b> ${val}`;
      });
    if (lines.length === 0) continue;
    message += `\n\n${group.title}\n${lines.join("\n")}`;
  }

  if (leftoverKeys.length > 0) {
    const lines = leftoverKeys.map((key) => `<b>${escapeHtml(key)}:</b> ${escapeHtml(data[key])}`);
    message += `\n\n▫️ Прочее\n${lines.join("\n")}`;
  }

  if (Object.keys(data).length === 0) {
    message += `\n\n<i>Данные не переданы</i>`;
  }

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  if (topicId) {
    payload.message_thread_id = Number(topicId);
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Telegram] Failed to send notification (${res.status}):`, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Telegram] Error sending message:", err);
    return false;
  }
}
