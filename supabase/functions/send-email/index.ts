const MS_TENANT_ID = Deno.env.get("MS_TENANT_ID")!;
const MS_CLIENT_ID = Deno.env.get("MS_CLIENT_ID")!;
const MS_CLIENT_SECRET = Deno.env.get("MS_CLIENT_SECRET")!;
const MS_FROM_EMAIL = Deno.env.get("MS_FROM_EMAIL")!;
const MS_SENDER = Deno.env.get("MS_SENDER") ?? "GPCompanion";
const HOOK_SECRET = Deno.env.get("SEND_EMAIL_HOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

async function getMSToken(): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: MS_CLIENT_ID,
        client_secret: MS_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  const json = await res.json();
  if (!json.access_token) throw new Error(`MS token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const token = await getMSToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${MS_FROM_EMAIL}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          toRecipients: [{ emailAddress: { address: to } }],
          from: { emailAddress: { address: MS_FROM_EMAIL, name: MS_SENDER } },
        },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph sendMail failed (${res.status}): ${err}`);
  }
}

function emailTemplate(
  title: string,
  body: string,
  ctaLabel: string,
  ctaUrl: string
): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation"
        style="background:#ffffff;border-radius:16px;border:1px solid #ccfbf1;overflow:hidden;max-width:560px">
        <tr><td style="height:4px;background:linear-gradient(90deg,#0d9488,#2dd4bf)"></td></tr>
        <tr><td style="padding:40px 48px 32px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:700;color:#0f172a">GP</span><span style="font-size:22px;font-weight:700;color:#0d9488">Companion</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px 0">${title}</h1>
          <p style="font-size:15px;color:#64748b;line-height:1.65;margin:0 0 32px 0">${body}</p>
          <a href="${ctaUrl}"
            style="display:inline-block;background:#0d9488;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.01em">
            ${ctaLabel}
          </a>
          <p style="font-size:12px;color:#94a3b8;margin:28px 0 0 0;word-break:break-all">
            Or copy this link into your browser:<br>
            <span style="color:#0d9488">${ctaUrl}</span>
          </p>
          <p style="font-size:12px;color:#94a3b8;margin:10px 0 0 0">
            This link expires in 24 hours. If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>
        <tr><td style="padding:18px 48px;border-top:1px solid #f1f5f9;background:#f8fafc">
          <p style="font-size:12px;color:#94a3b8;margin:0">© ${year} GPCompanion. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const TEMPLATES: Record<string, { subject: string; title: string; body: string; cta: string }> = {
  signup: {
    subject: "Verify your GPCompanion account",
    title: "Verify your email address",
    body: "Thank you for signing up to GPCompanion. Click the button below to verify your email and activate your 2-month free trial.",
    cta: "Verify Email",
  },
  recovery: {
    subject: "Reset your GPCompanion password",
    title: "Reset your password",
    body: "You requested a password reset. Click the button below to set a new password. If you didn't request this, no action is needed.",
    cta: "Reset Password",
  },
  invite: {
    subject: "You've been invited to GPCompanion",
    title: "You've been invited",
    body: "You have been invited to join GPCompanion. Click below to accept the invitation and set up your account.",
    cta: "Accept Invitation",
  },
  magic_link: {
    subject: "Your GPCompanion sign-in link",
    title: "Sign in to GPCompanion",
    body: "Click the button below to sign in to your account. This link expires in 10 minutes.",
    cta: "Sign In",
  },
  email_change: {
    subject: "Confirm your email change — GPCompanion",
    title: "Confirm your email change",
    body: "You requested to change your email address. Click below to confirm this change from your current email.",
    cta: "Confirm Change",
  },
  email_change_new: {
    subject: "Confirm your new email — GPCompanion",
    title: "Confirm your new email address",
    body: "Please confirm your new email address to complete the change on your GPCompanion account.",
    cta: "Confirm New Email",
  },
};

Deno.serve(async (req: Request) => {
  // Supabase auth hooks send the hook secret as a Bearer token
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${HOOK_SECRET}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: { user: { email: string }; email_data: Record<string, string> };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user, email_data } = payload;
  const { token_hash, redirect_to, email_action_type } = email_data;

  const verificationUrl =
    `${SUPABASE_URL}/auth/v1/verify` +
    `?token=${token_hash}` +
    `&type=${email_action_type}` +
    `&redirect_to=${encodeURIComponent(redirect_to)}`;

  const tmpl = TEMPLATES[email_action_type] ?? TEMPLATES.signup;

  try {
    await sendMail(
      user.email,
      tmpl.subject,
      emailTemplate(tmpl.title, tmpl.body, tmpl.cta, verificationUrl)
    );
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
