import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { notifyNewLead } from "@/lib/telegram"

const LEADS_KEY = "swatworks:demo_leads"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, company, source = "fleet-demo" } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const lead = {
      email,
      name: name || "",
      company: company || "",
      source,
      timestamp: Date.now(),
      date: new Date().toISOString(),
    }

    // Store lead in Redis
    await redis.hset(LEADS_KEY, { [email]: JSON.stringify(lead) })

    // Send secret notification to Telegram (async, non-blocking)
    notifyNewLead({ email, name, company, source }).catch(() => {
      // Silently fail - user should never know about this
    })

    return NextResponse.json({ success: true, message: "Lead captured successfully" })
  } catch (error) {
    console.error("Error capturing lead:", error)
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const leads = await redis.hgetall(LEADS_KEY)
    
    if (!leads || Object.keys(leads).length === 0) {
      return NextResponse.json({ leads: [], count: 0 })
    }

    const leadsList = Object.values(leads).map((data) => {
      return typeof data === "string" ? JSON.parse(data) : data
    })

    // Sort by timestamp descending
    leadsList.sort((a, b) => b.timestamp - a.timestamp)

    return NextResponse.json({ leads: leadsList, count: leadsList.length })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
