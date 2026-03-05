"use client"

import { useState, useCallback } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Services", href: "services" },
  { label: "How It Works", href: "how-it-works" },
  { label: "Pricing", href: "pricing" },
  { label: "FAQ", href: "faq" },
  { label: "Contact", href: "contact" },
]

// Custom easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(targetY: number, duration: number = 800) {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeInOutCubic(progress)
    window.scrollTo(0, startY + difference * easedProgress)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      smoothScrollTo(offsetTop, 800)
    }
    setMobileOpen(false)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground font-mono">SW</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            SWA<span className="text-primary">Tech</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://swatworks.net/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80"
          >
            <span className="text-xs font-bold text-primary">WP</span>
            <span className="text-muted-foreground">Dashboard</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 btn-hover cursor-pointer"
          >
            Schedule a Demo
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={`#${link.href}`}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://swatworks.net/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-xs font-bold text-primary">WP</span>
              Dashboard
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground cursor-pointer"
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
