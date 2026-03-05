"use client"

import { useEffect, useState, useCallback } from "react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "Process" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
]

// Custom easing function - ease-in-out cubic
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Smooth scroll with custom easing
function smoothScrollTo(targetY: number, duration: number = 1000) {
  const startY = window.scrollY
  const difference = targetY - startY
  const startTime = performance.now()

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeInOutCubic(progress)
    
    window.scrollTo(0, startY + difference * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function ScrollNavigation() {
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      // Show after scrolling past hero
      setIsVisible(scrollTop > 300)

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 3) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for fixed navbar
      smoothScrollTo(offsetTop, 800)
    }
  }, [])

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-border/30">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Side Navigation Dots */}
      <div
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${section.label}`}
          >
            {/* Label tooltip */}
            <span className="absolute right-8 whitespace-nowrap rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:right-10">
              {section.label}
            </span>
            
            {/* Dot */}
            <div
              className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            >
              {/* Active pulse */}
              {activeSection === section.id && (
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => smoothScrollTo(0, 800)}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-500 hover:bg-primary/90 hover:scale-110 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  )
}

// Hook to use smooth scroll in other components
export function useSmoothScroll() {
  const scrollTo = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      smoothScrollTo(offsetTop, 800)
    }
  }, [])

  return { scrollTo }
}
