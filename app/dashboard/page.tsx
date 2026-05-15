import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import Stripe from "stripe"
import { Navbar } from "@/components/navbar"
import { DashboardClient } from "./DashboardClient"

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const admin = getSupabaseAdmin()

  let { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Profile missing — auto-create from auth metadata
  if (!profile) {
    const meta = user.user_metadata ?? {}
    await admin.from("profiles").insert({
      id: user.id,
      first_name: meta.first_name ?? "",
      last_name: meta.last_name ?? "",
      clinic_name: meta.clinic_name ?? "",
      clinic_address: meta.clinic_address ?? "",
      position: meta.position ?? "",
      phone_number: meta.phone_number ?? "",
      email: user.email ?? "",
    })
    const { data: newProfile } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = newProfile
  }

  let { data: subscription } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Subscription missing — auto-create trial
  if (!subscription) {
    await admin.from("subscriptions").insert({ user_id: user.id })
    const { data: newSub } = await admin
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()
    subscription = newSub
  }

  // Fetch invoices from Stripe if customer exists
  type Invoice = { id: string; date: string; amount: string; status: string; description: string }
  let invoices: Invoice[] = []

  if (subscription?.stripe_customer_id) {
    try {
      const stripe = getStripe()
      const { data } = await stripe.invoices.list({
        customer: subscription.stripe_customer_id,
        limit: 10,
      })
      invoices = data.map((inv) => ({
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }),
        amount: `$${(inv.amount_paid / 100).toFixed(2)}`,
        status: inv.status ?? "unknown",
        description: inv.lines.data[0]?.description ?? "Subscription",
      }))
    } catch {
      // silently skip if Stripe call fails
    }
  }

  if (!profile || !subscription) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <p className="text-slate-500 text-sm">Unable to load your account. Please try signing out and back in.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <DashboardClient profile={profile} subscription={subscription} invoices={invoices} />
        </div>
      </main>
    </div>
  )
}
