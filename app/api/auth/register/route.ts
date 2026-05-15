import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  clinic_name: z.string().min(1, "Clinic name is required").max(200),
  clinic_address: z.string().min(1, "Clinic address is required").max(500),
  position: z.string().min(1, "Position is required").max(100),
  phone_number: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\s\-()]+$/, "Enter a valid phone number"),
})

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = registerSchema.safeParse(rawBody)
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid input"
    return NextResponse.json({ error: message }, { status: 422 })
  }

  const { email, password, first_name, last_name, clinic_name, clinic_address, position, phone_number } = parsed.data

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
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Create trial subscription
  await supabase.from("subscriptions").insert({ user_id: authData.user.id })

  // Generate verification link and send via the send-email edge function
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (linkError || !linkData?.properties) {
    console.error("generateLink error:", linkError)
    return NextResponse.json({ success: true, warning: "Account created but verification email could not be sent." })
  }

  const { hashed_token, redirect_to, verification_type } = linkData.properties

  const emailRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SEND_EMAIL_HOOK_SECRET}`,
      },
      body: JSON.stringify({
        user: { email },
        email_data: {
          token_hash: hashed_token,
          redirect_to,
          email_action_type: verification_type,
        },
      }),
    }
  )

  if (!emailRes.ok) {
    const err = await emailRes.text()
    console.error("send-email edge function error:", err)
    return NextResponse.json({ success: true, warning: "Account created but verification email could not be sent." })
  }

  return NextResponse.json({ success: true })
}
