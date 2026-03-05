"use client"

import {
  Globe,
  LayoutDashboard,
  Database,
  ShieldCheck,
  Mail,
  BarChart3,
} from "lucide-react"
import { FadeInSection } from "@/hooks/use-scroll-animation"

const services = [
  {
    icon: Globe,
    title: "Landing Pages",
    description:
      "Modern, responsive websites that make a lasting impression. Optimized for conversions with built-in analytics.",
  },
  {
    icon: LayoutDashboard,
    title: "Business Management Systems",
    description:
      "Custom dashboards, CRM, inventory, scheduling, and reporting systems built around how your team works.",
  },
  {
    icon: Database,
    title: "Custom Software",
    description:
      "Need something unique? We build tailored applications that solve your specific business challenges.",
  },
  {
    icon: Mail,
    title: "Corporate Email & Domain",
    description:
      "Professional email addresses on your own domain. We handle setup, DNS, and ongoing management.",
  },
  {
    icon: ShieldCheck,
    title: "Online Forms & Surveys",
    description:
      "Collect leads, feedback, and applications with custom-branded forms integrated directly into your site.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Know your numbers. We integrate tracking, dashboards, and automated reports so you always have visibility.",
  },
]

export function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <FadeInSection>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              What We Offer
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl font-mono text-balance">
              Everything your business needs to go digital
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
              We handle the technology so you can handle your business.
              Every solution is adapted to fit your exact workflow.
            </p>
          </div>
        </FadeInSection>

        {/* Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeInSection key={service.title} delay={index * 100}>
              <div
                className="group relative rounded-xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:bg-card/80 card-hover glow-hover h-full"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 group-hover:scale-110 transition-transform">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}
