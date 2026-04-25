import { createServerClient } from "@supabase/ssr"
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

    // Check subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status, trial_end, plan")
      .eq("user_id", user.id)
      .single()

    if (!subscription) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const now = new Date()
    const trialExpired =
      subscription.status === "trialing" && new Date(subscription.trial_end) < now

    const isExpiredOrCanceled =
      subscription.status === "expired" ||
      subscription.status === "canceled" ||
      trialExpired

    if (isExpiredOrCanceled && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard?upgrade=true", request.url))
    }
  }

  // Protect admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const { data: profile } = await supabase
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
    "/((?!_next/static|_next/image|favicon.ico|images|api/stripe/webhook).*)",
  ],
}
