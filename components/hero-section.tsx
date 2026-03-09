"use client"

import { ArrowRight, Play, Navigation, Sparkles, Send } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import type { VehicleLocation } from "@/lib/redis"
import { DynamicMap } from "./dynamic-map"

interface HeroProps {
  onAccessGranted?: (email: string) => void
  hasAccess?: boolean
}

const words = ["Landing Pages", "Business Systems", "Custom Software", "Fleet Tracking"]

// Floating Lead Capture Form with Email Verification
function LeadCaptureForm({ onSubmit }: { onSubmit: (email: string, name: string) => void }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"email" | "verify" | "success">("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "request" }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.alreadyActive) {
          setError("This email already has an active demo. Only one session per email allowed.")
        } else {
          setError(data.error || "Failed to send code")
        }
        return
      }

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "fleet-demo" }),
      })
      
      setStep("verify")
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, action: "verify" }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Invalid code")
        return
      }

      localStorage.setItem("swatworks-demo-session", JSON.stringify({ 
        email, 
        sessionId: data.sessionId,
        expiresAt: data.expiresAt 
      }))
      
      setStep("success")
      onSubmit(email, name)
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-green-500 text-sm">Verified!</p>
            <p className="text-[10px] md:text-xs text-green-500/70">24h access - Open /driver</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === "verify") {
    return (
      <form onSubmit={handleVerifyCode} className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm space-y-2 md:space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-medium text-foreground">Enter verification code</p>
        </div>
        <p className="text-[10px] text-muted-foreground">
          We sent a 6-digit code to {email}. Check your inbox.
        </p>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-center font-mono tracking-widest"
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting || verificationCode.length !== 6}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs md:text-sm transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
        <button
          type="button"
          onClick={() => { setStep("email"); setError("") }}
          className="w-full text-[10px] text-muted-foreground hover:text-foreground"
        >
          Use different email
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequestCode} className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm space-y-2 md:space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] md:text-xs font-medium text-foreground">Try the live demo</p>
        </div>
        <span className="text-[8px] md:text-[10px] text-muted-foreground bg-secondary px-1.5 md:px-2 py-0.5 rounded-full">24h access</span>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs md:text-sm"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs md:text-sm"
      />
      {error && <p className="text-[10px] text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs md:text-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Get Verification Code
          </>
        )}
      </button>
      <p className="text-[8px] md:text-[10px] text-muted-foreground/60 text-center">
        One session per email. We verify to prevent abuse.
      </p>
    </form>
  )
}

export function Hero({ onAccessGranted, hasAccess }: HeroProps = {}) {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [hasSubmittedLead, setHasSubmittedLead] = useState(hasAccess || false)

  useEffect(() => {
    if (hasAccess !== undefined) {
      setHasSubmittedLead(hasAccess)
    }
  }, [hasAccess])

  useEffect(() => {
    if (hasAccess !== undefined) return
    
    const savedData = localStorage.getItem("swatworks-demo-lead")
    if (savedData) {
      try {
        const { timestamp } = JSON.parse(savedData)
        const now = Date.now()
        const hours24 = 24 * 60 * 60 * 1000
        if (now - timestamp < hours24) {
          setHasSubmittedLead(true)
        } else {
          localStorage.removeItem("swatworks-demo-lead")
        }
      } catch {
        localStorage.removeItem("swatworks-demo-lead")
      }
    }
  }, [hasAccess])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length)
        setIsVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/location")
      const data = await res.json()
      if (data.vehicles) {
        setVehicles(data.vehicles)
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
    const interval = setInterval(fetchVehicles, 2000)
    return () => clearInterval(interval)
  }, [fetchVehicles])

  const activeCount = vehicles.filter(v => v.status === "active").length
  const totalCount = vehicles.length

  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Serving Tampa, FL & Beyond</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl text-balance font-mono">
              We Build{" "}
              <span
                className={`inline-block text-primary transition-all duration-400 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                {words[currentWord]}
              </span>
              <br />
              <span className="text-muted-foreground">For Your Business</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg text-pretty">
              From a simple landing page to real-time fleet tracking systems.
              We adapt every solution to your exact needs.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href="#pricing"
                className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                See Plans & Pricing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-border"
              >
                <Play className="h-4 w-4 text-primary" />
                How It Works
              </a>
            </div>

            <div className="mt-6 md:mt-10 grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-4">
              {[
                { value: "50+", label: "Projects" },
                { value: "99%", label: "Uptime" },
                { value: "24/7", label: "Support" },
                { value: "$199", label: "Starting/yr" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-xl md:text-2xl font-bold text-foreground font-mono">{stat.value}</span>
                  <span className="mt-0.5 text-[10px] md:text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 md:gap-2 rounded-full border border-primary/30 bg-primary/10 px-2 md:px-3 py-1">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-semibold text-primary">LIVE DEMO</span>
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">
                  Real-time Fleet Tracking
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                <Navigation className="w-3 h-3 text-primary" />
                {activeCount}/{totalCount} active
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
              <DynamicMap vehicles={vehicles} />
              
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-52 sm:w-64">
                {!hasSubmittedLead ? (
                  <LeadCaptureForm onSubmit={(email) => {
                      setHasSubmittedLead(true)
                      if (onAccessGranted) onAccessGranted(email)
                    }} />
                ) : (
                  <div className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-2 sm:p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] sm:text-xs text-foreground">Demo unlocked!</p>
                    </div>
                    <a 
                      href="/driver" 
                      target="_blank"
                      className="mt-2 block w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-primary/10 text-primary text-[10px] sm:text-xs font-medium text-center hover:bg-primary/20 active:scale-95 transition-all"
                    >
                      Open Driver App
                    </a>
                  </div>
                )}
              </div>

              {vehicles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
                  <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-card/80 backdrop-blur-sm border border-border max-w-xs">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
                      <Navigation className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm md:text-base">Waiting for vehicles...</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Open /driver on your phone to start
                    </p>
                  </div>
                </div>
              )}

              {vehicles.length > 0 && (
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 flex gap-1.5 sm:gap-2">
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Vehicles</p>
                    <p className="text-sm sm:text-lg font-bold text-foreground">{totalCount}</p>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Active</p>
                    <p className="text-sm sm:text-lg font-bold text-green-500">{activeCount}</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center">
              This is a working demo. Vehicles update in real-time every 2 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
