export type Plan = "trial" | "weekly" | "monthly" | "yearly"
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "expired"

export interface Profile {
  id: string
  first_name: string
  last_name: string
  clinic_name: string
  clinic_address: string
  position: string
  phone_number: string
  email: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: Plan
  status: SubscriptionStatus
  trial_start: string
  trial_end: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface ProfileWithSubscription extends Profile {
  subscriptions: Subscription | null
}
