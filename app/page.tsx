// Main landing page - SWATech
import { Navbar } from "@/components/navbar"
import { ScrollNavigation } from "@/components/scroll-navigation"
import { DemosSection } from "@/components/demos-section"
import { Services } from "@/components/services"
import { HowItWorks } from "@/components/how-it-works"
import { ExclusivityBanner } from "@/components/exclusivity-banner"
import { GoogleReviews } from "@/components/google-reviews"
import { FAQ } from "@/components/faq"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ScrollNavigation />
      <section id="hero">
        <DemosSection />
      </section>
      <Services />
      <HowItWorks />
      <ExclusivityBanner />
      <GoogleReviews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
