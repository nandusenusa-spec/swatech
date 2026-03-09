"use client"

// SWATech Demo Section - Hero + Inventory demos
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { InventoryDemo } from "./inventory-demo"

// Dynamic import Hero to avoid SSR issues with Leaflet
const Hero = dynamic(() => import("./hero-section").then(mod => ({ default: mod.Hero })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading demo...</p>
      </div>
    </div>
  ),
})

export function DemosSection() {
  const [hasAccess, setHasAccess] = useState(false)
  const [email, setEmail] = useState("")

  // Check localStorage for existing access (with 24h expiration)
  useEffect(() => {
    const savedData = localStorage.getItem("swatech-demo-lead")
    if (savedData) {
      try {
        const { timestamp, email: savedEmail } = JSON.parse(savedData)
        const now = Date.now()
        const hours24 = 24 * 60 * 60 * 1000
        if (now - timestamp < hours24) {
          setHasAccess(true)
          setEmail(savedEmail || "")
        } else {
          localStorage.removeItem("swatech-demo-lead")
        }
      } catch {
        localStorage.removeItem("swatech-demo-lead")
      }
    }
  }, [])

  const handleAccessGranted = (userEmail: string) => {
    setHasAccess(true)
    setEmail(userEmail)
  }

  const handleRequestAccess = () => {
    // Scroll to the fleet demo section where the email form is
    const fleetSection = document.getElementById("fleet-demo")
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <div id="fleet-demo">
        <Hero onAccessGranted={handleAccessGranted} hasAccess={hasAccess} />
      </div>
      <InventoryDemo hasAccess={hasAccess} onRequestAccess={handleRequestAccess} />
    </>
  )
}
