import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const supabaseAdmin = getSupabaseAdmin()

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const subscription = event.data.object as Stripe.Subscription

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (userId && plan) {
        await supabaseAdmin
          .from("subscriptions")
          .update({
            stripe_subscription_id: session.subscription as string,
            plan,
            status: "active",
            current_period_start: new Date().toISOString(),
          })
          .eq("user_id", userId)
      }
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const stripeSubId = (invoice.subscription ?? (invoice as any).parent?.subscription_details?.subscription) as string | undefined
      if (!stripeSubId) break

      const sub = await stripe.subscriptions.retrieve(stripeSubId)
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", stripeSubId)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const stripeSubId = (invoice.subscription ?? (invoice as any).parent?.subscription_details?.subscription) as string | undefined
      if (!stripeSubId) break

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", stripeSubId)
      break
    }

    case "customer.subscription.deleted": {
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled", stripe_subscription_id: null })
        .eq("stripe_subscription_id", subscription.id)
      break
    }

    case "customer.subscription.updated": {
      const status = subscription.status === "active" ? "active" : "past_due"
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
