"use client"

import { useState, useEffect } from "react"
import { Hero } from "./hero"
import { InventoryDemo } from "./inventory-demo"

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
