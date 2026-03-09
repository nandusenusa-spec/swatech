"use client"

import { useEffect, useState, useCallback, useRef } from "react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "Process" },
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
  const wheelCountRef = useRef(0)
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)

  // Get current section index
  const getCurrentSectionIndex = useCallback(() => {
    return sections.findIndex(s => s.id === activeSection)
  }, [activeSection])

  // Scroll to section by index
  const scrollToSectionByIndex = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return
    const element = document.getElementById(sections[index].id)
    if (element) {
      isScrollingRef.current = true
      const offsetTop = element.offsetTop - 80
      smoothScrollTo(offsetTop, 800)
      setTimeout(() => {
        isScrollingRef.current = false
      }, 900)
    }
  }, [])

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

    // Wheel handler with threshold (3 scrolls to trigger)
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return

      // Clear timeout if exists
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current)
      }

      // Accumulate wheel events
      const direction = e.deltaY > 0 ? 1 : -1
      wheelCountRef.current += direction

      // Reset counter after 500ms of no scrolling
      wheelTimeoutRef.current = setTimeout(() => {
        wheelCountRef.current = 0
      }, 500)

      // Trigger section change after 3 wheel movements in same direction
      if (Math.abs(wheelCountRef.current) >= 3) {
        const currentIndex = getCurrentSectionIndex()
        const newIndex = direction > 0 ? currentIndex + 1 : currentIndex - 1
        scrollToSectionByIndex(newIndex)
        wheelCountRef.current = 0
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("wheel", handleWheel, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleWheel)
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
    }
  }, [getCurrentSectionIndex, scrollToSectionByIndex])

  return (
    <>
      {/* Top Progress Bar - 2px height */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-border/20">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button - optimized for mobile */}
      <button
        onClick={() => smoothScrollTo(0, 800)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-500 hover:bg-primary/90 hover:scale-110 active:scale-95 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="md:w-5 md:h-5"
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
