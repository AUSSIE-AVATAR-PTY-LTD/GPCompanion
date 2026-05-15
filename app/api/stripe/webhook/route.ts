import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { sendEmail, paymentFailedHtml } from "@/lib/email"

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Maps Stripe subscription statuses to our internal statuses
const STRIPE_STATUS_MAP: Record<string, string> = {
  active: "active",
  trialing: "trialing",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "past_due",
  incomplete: "past_due",
  incomplete_expired: "expired",
  paused: "past_due",
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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan
      const stripeSubId = session.subscription as string

      if (userId && plan && stripeSubId) {
        const sub = await stripe.subscriptions.retrieve(stripeSubId)
        const status = STRIPE_STATUS_MAP[sub.status] ?? "active"

        await supabaseAdmin
          .from("subscriptions")
          .update({
            stripe_subscription_id: stripeSubId,
            plan,
            status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq("user_id", userId)
      }
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const stripeSubId = (
        invoice.subscription ??
        (invoice as any).parent?.subscription_details?.subscription
      ) as string | undefined

      if (!stripeSubId) break

      const sub = await stripe.subscriptions.retrieve(stripeSubId)
      const update = {
        stripe_subscription_id: stripeSubId,
        status: "active",
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }

      // Primary: update by subscription_id (covers renewals)
      const { data: updated } = await supabaseAdmin
        .from("subscriptions")
        .update(update)
        .eq("stripe_subscription_id", stripeSubId)
        .select("id")

      // Fallback: update by customer_id in case checkout.session.completed hasn't run yet
      if (!updated || updated.length === 0) {
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id
        if (customerId) {
          await supabaseAdmin
            .from("subscriptions")
            .update(update)
            .eq("stripe_customer_id", customerId)
        }
      }
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const stripeSubId = (
        invoice.subscription ??
        (invoice as any).parent?.subscription_details?.subscription
      ) as string | undefined

      if (!stripeSubId) break

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", stripeSubId)

      // Look up the user to send a payment failure email
      try {
        const { data: subRow } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", stripeSubId)
          .single()

        if (subRow?.user_id) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("email, first_name")
            .eq("id", subRow.user_id)
            .single()

          if (profile?.email) {
            const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
            await sendEmail(
              profile.email,
              "Action required — GPCompanion payment failed",
              paymentFailedHtml(profile.first_name ?? "there", dashboardUrl)
            )
          }
        }
      } catch (err) {
        console.error("Failed to send payment failure email:", err)
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled", stripe_subscription_id: null })
        .eq("stripe_subscription_id", subscription.id)
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const status = STRIPE_STATUS_MAP[subscription.status] ?? "past_due"

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
