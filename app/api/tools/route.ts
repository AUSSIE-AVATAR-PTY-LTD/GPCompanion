import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { readFile } from "fs/promises"
import path from "path"

const ALLOWED_FILES: Record<string, string> = {
  "gpccmp":                "GPCCMP and Review generator.html",
  "1554":                  "1554.html",
  "diabetes-risk":         "40-49DiabetesRiskAssessment.html",
  "health-check-45":       "45-49YearHealthCheck.html",
  "health-assessment-75":  "75+HealthAssessment.html",
  "adf-veteran":           "ADFVeteran.html",
  "atsi-child":            "ATSIChild.html",
  "atsi-senior":           "ATSISenior.html",
  "aged-care":             "AgedCare.html",
  "heart-health":          "Hearthealthassessment.html",
  "id":                    "ID.html",
  "menopause":             "MenopauseandPerimenopause.html",
  "refugee":               "Refugee.html",
}

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tool = searchParams.get("tool")

  if (!tool || !ALLOWED_FILES[tool]) {
    return NextResponse.redirect(new URL("/HealthAssessments", request.url))
  }

  // Use getUser() for secure server-side auth validation
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const userId = user.id
  const admin = getSupabaseAdmin()

  // Use admin client to bypass RLS for subscription check
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("status, trial_end")
    .eq("user_id", userId)
    .single()

  if (!subscription) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const now = new Date()
  const trialExpired =
    subscription.status === "trialing" && new Date(subscription.trial_end) < now
  const isBlocked =
    subscription.status === "expired" ||
    subscription.status === "canceled" ||
    trialExpired

  if (isBlocked) {
    return NextResponse.redirect(new URL("/dashboard?upgrade=true", request.url))
  }

  // Serve the file
  const filePath = path.join(process.cwd(), "tools", ALLOWED_FILES[tool])

  try {
    let html = await readFile(filePath, "utf-8")

    const navbar = `
<style>
  /* Hide the existing nav built into the HTML tool */
  body > nav { display: none !important; }
  #gpc-navbar {
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #ffffff;
    border-bottom: 1px solid #e0e7ff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  #gpc-navbar .gpc-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #gpc-navbar .gpc-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.15rem;
    color: #3730a3;
    flex-shrink: 0;
  }
  #gpc-navbar .gpc-brand img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }
  #gpc-navbar .gpc-links {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }
  #gpc-navbar .gpc-links a {
    text-decoration: none;
    color: #4338ca;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  #gpc-navbar .gpc-links a:hover { color: #1e1b4b; background: #eef2ff; }
  #gpc-navbar .gpc-links a.gpc-back {
    background: #4f46e5;
    color: #ffffff !important;
    margin-left: 0.5rem;
    font-weight: 600;
  }
  #gpc-navbar .gpc-links a.gpc-back:hover { background: #4338ca; }
</style>
<div id="gpc-navbar">
  <div class="gpc-inner">
    <a href="/" class="gpc-brand">
      <img src="/images/gp-companion-logo.png" alt="GP Companion" />
      GP Companion
    </a>
    <div class="gpc-links">
      <a href="/">Home</a>
      <a href="/pricing">Pricing</a>
      <a href="/about">About</a>
      <a href="/developer">Developer</a>
      <a href="/privacy">Privacy</a>
      <a href="/contact">Contact</a>
      <a href="/dashboard" class="gpc-back">&#8592; Back to Dashboard</a>
    </div>
  </div>
</div>`

    // Inject navbar right after <body> tag
    if (html.includes("<body")) {
      html = html.replace(/(<body[^>]*>)/i, `$1\n${navbar}`)
    } else {
      html = navbar + html
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        // Tools load Tailwind CDN, Google Fonts, Chart.js, etc.
        // Override the global CSP with a permissive policy for these trusted files.
        "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      },
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
