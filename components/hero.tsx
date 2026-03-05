"use client"

import { ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"

const words = ["Landing Pages", "Business Systems", "Custom Software", "E-Commerce Stores"]

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

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

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Serving Tampa, FL & Beyond</span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance font-mono">
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

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            From a simple landing page to a complete business management system.
            We adapt every solution to your exact needs, so you can focus on growing your company.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              See Plans & Pricing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-border"
            >
              <Play className="h-4 w-4 text-primary" />
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border/50 pt-10 md:grid-cols-4 md:gap-16">
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "99%", label: "Uptime Guarantee" },
              { value: "24/7", label: "Support Available" },
              { value: "$200", label: "Starting Price/yr" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-foreground font-mono">{stat.value}</span>
                <span className="mt-1 text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
