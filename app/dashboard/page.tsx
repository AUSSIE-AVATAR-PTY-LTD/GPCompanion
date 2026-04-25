import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Navbar } from "@/components/navbar"
import { DashboardClient } from "./DashboardClient"

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <DashboardClient profile={profile} subscription={subscription} />
        </div>
      </main>
    </div>
  )
}
