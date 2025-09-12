import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = await createClient()

    // Insert contact message into database
    const { data, error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
