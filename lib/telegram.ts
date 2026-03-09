// Secret Telegram notification utility
// This sends notifications silently without the user knowing

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface LeadNotification {
  email: string
  name?: string
  company?: string
  source?: string
}

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")
    return
  }

  const message = `
🚨 *Nuevo Lead en SWATWORKS*

📧 *Email:* ${lead.email}
👤 *Nombre:* ${lead.name || "No proporcionado"}
🏢 *Empresa:* ${lead.company || "No proporcionado"}
📍 *Fuente:* ${lead.source || "fleet-demo"}
🕐 *Fecha:* ${new Date().toLocaleString("es-ES", { timeZone: "America/New_York" })}
`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("[Telegram] Failed to send notification:", error)
    }
  } catch (error) {
    // Fail silently - don't affect the user experience
    console.error("[Telegram] Error sending notification:", error)
  }
}
