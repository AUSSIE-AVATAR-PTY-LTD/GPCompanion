import { createServerClient } from "@supabase/ssr"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PATHS = ["/gpccmp", "/HealthAssessments", "/dashboard"]
const ADMIN_PATHS = ["/admin"]
const AUTH_PATHS = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Redirect logged-in users away from auth pages
  if (user && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect tool and dashboard routes
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Use admin client to bypass RLS for subscription check
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: subscription } = await admin
      .from("subscriptions")
      .select("status, trial_end")
      .eq("user_id", user.id)
      .single()

    if (!subscription) {
      if (!pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return supabaseResponse
    }

    const now = new Date()
    const trialExpired =
      subscription.status === "trialing" && new Date(subscription.trial_end) < now

    const isBlocked =
      subscription.status === "expired" ||
      subscription.status === "canceled" ||
      subscription.status === "past_due" ||
      trialExpired

    if (isBlocked && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard?upgrade=true", request.url))
    }
  }

  // Protect admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/stripe/webhook|api/tools).*)",
  ],
}
