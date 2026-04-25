import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

const PRICE_MAP: Record<string, string> = {
  weekly: process.env.STRIPE_PRICE_WEEKLY!,
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  yearly: process.env.STRIPE_PRICE_YEARLY!,
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await request.json()

  if (!PRICE_MAP[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, first_name, last_name, stripe_customer_id")
    .eq("id", user.id)
    .single()

  // Re-use existing Stripe customer or create new
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  let customerId = sub?.stripe_customer_id

  const stripe = getStripe()

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email,
      name: `${profile?.first_name} ${profile?.last_name}`,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: PRICE_MAP[plan], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=canceled`,
    metadata: { user_id: user.id, plan },
  })

  return NextResponse.json({ url: session.url })
}
