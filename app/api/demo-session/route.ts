import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const SESSION_KEY = "swatworks:demo_sessions"
const VERIFICATION_KEY = "swatworks:email_verification"
const SESSION_TTL = 86400 // 24 hours in seconds

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST - Request verification code or verify code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, action } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Action: Request verification code
    if (action === "request") {
      // Check if email already has an active session
      const existingSession = await redis.hget(SESSION_KEY, normalizedEmail)
      if (existingSession) {
        const session = typeof existingSession === "string" 
          ? JSON.parse(existingSession) 
          : existingSession
        
        // Check if session is still valid (within 24 hours)
        if (session.expiresAt > Date.now()) {
          return NextResponse.json({ 
            error: "This email already has an active demo session. Only one session per email is allowed.",
            alreadyActive: true,
            expiresAt: session.expiresAt
          }, { status: 409 })
        }
      }

      // Generate and store verification code (expires in 10 minutes)
      const verificationCode = generateCode()
      await redis.set(
        `${VERIFICATION_KEY}:${normalizedEmail}`, 
        verificationCode, 
        { ex: 600 } // 10 minutes
      )

      // In production, send email here. For demo, we'll return success and show the code
      console.log(`[DEMO] Verification code for ${normalizedEmail}: ${verificationCode}`)

      return NextResponse.json({ 
        success: true, 
        message: "Verification code sent to your email",
        // For demo purposes, always include the code so users can test the app
        demoCode: verificationCode
      })
    }

    // Action: Verify code
    if (action === "verify") {
      if (!code) {
        return NextResponse.json({ error: "Verification code is required" }, { status: 400 })
      }

      // Check stored verification code
      const storedCode = await redis.get(`${VERIFICATION_KEY}:${normalizedEmail}`)
      
      if (!storedCode) {
        return NextResponse.json({ 
          error: "Verification code expired or not found. Please request a new code." 
        }, { status: 400 })
      }

      if (storedCode !== code) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
      }

      // Code is valid - create session
      const sessionId = crypto.randomUUID()
      const session = {
        sessionId,
        email: normalizedEmail,
        createdAt: Date.now(),
        expiresAt: Date.now() + (SESSION_TTL * 1000),
        verified: true
      }

      await redis.hset(SESSION_KEY, { [normalizedEmail]: JSON.stringify(session) })
      
      // Delete used verification code
      await redis.del(`${VERIFICATION_KEY}:${normalizedEmail}`)

      return NextResponse.json({ 
        success: true, 
        sessionId,
        expiresAt: session.expiresAt,
        message: "Email verified! Demo access granted for 24 hours."
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error) {
    console.error("Error in demo session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Check if session is valid
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")
    const sessionId = request.nextUrl.searchParams.get("sessionId")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingSession = await redis.hget(SESSION_KEY, normalizedEmail)

    if (!existingSession) {
      return NextResponse.json({ valid: false, reason: "no_session" })
    }

    const session = typeof existingSession === "string" 
      ? JSON.parse(existingSession) 
      : existingSession

    // Check expiration
    if (session.expiresAt < Date.now()) {
      await redis.hdel(SESSION_KEY, normalizedEmail)
      return NextResponse.json({ valid: false, reason: "expired" })
    }

    // If sessionId provided, verify it matches
    if (sessionId && session.sessionId !== sessionId) {
      return NextResponse.json({ 
        valid: false, 
        reason: "session_mismatch",
        message: "Another device is using this email for demo access."
      })
    }

    return NextResponse.json({ 
      valid: true, 
      expiresAt: session.expiresAt,
      remainingTime: session.expiresAt - Date.now()
    })

  } catch (error) {
    console.error("Error checking session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - End session
export async function DELETE(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    await redis.hdel(SESSION_KEY, normalizedEmail)

    return NextResponse.json({ success: true, message: "Session ended" })

  } catch (error) {
    console.error("Error ending session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
