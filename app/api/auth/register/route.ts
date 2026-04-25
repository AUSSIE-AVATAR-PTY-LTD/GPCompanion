import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    email,
    password,
    first_name,
    last_name,
    clinic_name,
    clinic_address,
    position,
    phone_number,
  } = body

  const supabase = getSupabaseAdmin()

  // Check phone uniqueness
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("phone_number", phone_number)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: "An account with this phone number already exists." },
      { status: 409 }
    )
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { first_name, last_name },
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create account." },
      { status: 400 }
    )
  }

  // Insert profile using service role (bypasses RLS)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    first_name,
    last_name,
    clinic_name,
    clinic_address,
    position,
    phone_number,
    email,
  })

  if (profileError) {
    // Clean up auth user if profile insert fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Create trial subscription
  await supabase.from("subscriptions").insert({ user_id: authData.user.id })

  // Send verification email
  await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  return NextResponse.json({ success: true })
}
