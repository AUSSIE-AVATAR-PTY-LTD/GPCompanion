async function getMSToken(): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MS_CLIENT_ID!,
        client_secret: process.env.MS_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  )
  const json = await res.json()
  if (!json.access_token) throw new Error(`MS token error: ${JSON.stringify(json)}`)
  return json.access_token
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_FROM_EMAIL } = process.env
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET || !MS_FROM_EMAIL) {
    console.warn("Email env vars not configured — skipping transactional email")
    return
  }
  const token = await getMSToken()
  const senderName = process.env.MS_SENDER ?? "GPCompanion"
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${MS_FROM_EMAIL}/sendMail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          toRecipients: [{ emailAddress: { address: to } }],
          from: { emailAddress: { address: MS_FROM_EMAIL, name: senderName } },
        },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Graph sendMail failed (${res.status}): ${err}`)
  }
}

export function paymentFailedHtml(firstName: string, dashboardUrl: string): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation"
        style="background:#ffffff;border-radius:16px;border:1px solid #fecaca;overflow:hidden;max-width:560px">
        <tr><td style="height:4px;background:linear-gradient(90deg,#ef4444,#f87171)"></td></tr>
        <tr><td style="padding:40px 48px 32px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:700;color:#0f172a">GP</span><span style="font-size:22px;font-weight:700;color:#0d9488">Companion</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px 0">Payment failed</h1>
          <p style="font-size:15px;color:#64748b;line-height:1.65;margin:0 0 32px 0">
            Hi ${firstName}, we were unable to process your latest payment for GPCompanion.
            Please update your payment details to continue accessing your clinical tools.
          </p>
          <a href="${dashboardUrl}"
            style="display:inline-block;background:#0d9488;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.01em">
            Update Payment Details
          </a>
          <p style="font-size:12px;color:#94a3b8;margin:28px 0 0 0">
            If you believe this is an error, please contact us. You will retain access until the grace period ends.
          </p>
        </td></tr>
        <tr><td style="padding:18px 48px;border-top:1px solid #f1f5f9;background:#f8fafc">
          <p style="font-size:12px;color:#94a3b8;margin:0">&copy; ${year} GPCompanion. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
