"use client"

import { Check, Zap } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    name: "Starter",
    description: "Perfect for solopreneurs and small businesses just getting online.",
    priceMonthly: "$17",
    priceYearly: "$200",
    period: "year",
    highlight: false,
    employeeRange: "Solo / 1 person",
    features: [
      "Custom Landing Page",
      "Contact Form & Lead Capture",
      "Corporate Email Address",
      "Custom Domain Setup",
      "Mobile Responsive Design",
      "Basic Analytics",
      "SSL Certificate Included",
    ],
  },
  {
    name: "Business",
    description: "For growing companies that need tools to manage their operations.",
    priceMonthly: "$99",
    priceYearly: "$990",
    period: "month",
    highlight: true,
    employeeRange: "1 - 10 employees",
    features: [
      "Everything in Starter",
      "Custom Business Dashboard",
      "CRM & Client Management",
      "Scheduling System",
      "Inventory Management",
      "Automated Reports",
      "Online Surveys & Forms",
      "Priority Email Support",
    ],
  },
  {
    name: "Professional",
    description: "For established businesses needing advanced integrations and scale.",
    priceMonthly: "$199",
    priceYearly: "$1,990",
    period: "month",
    highlight: false,
    employeeRange: "11 - 50 employees",
    features: [
      "Everything in Business",
      "Custom Software Modules",
      "API Integrations",
      "Multi-location Support",
      "Advanced Analytics & BI",
      "Role-based Access Control",
      "Dedicated Account Manager",
      "Phone & Chat Support",
    ],
  },
  {
    name: "Enterprise",
    description: "Full custom solutions for large organizations with unique requirements.",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    period: "",
    highlight: false,
    employeeRange: "50+ employees",
    features: [
      "Everything in Professional",
      "Fully Custom Architecture",
      "On-premise or Cloud Deploy",
      "SLA Guarantee",
      "24/7 Dedicated Support",
      "Training & Onboarding",
      "Custom Compliance (HIPAA, etc.)",
      "Unlimited Users",
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Plans & Pricing
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl font-mono text-balance">
            Transparent pricing that scales with your business
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Start small with a landing page or go all-in with a complete system.
            Pricing adjusts based on your team size and needs.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center gap-3 rounded-full border border-border bg-secondary p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-bold">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-8 transition-all ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-[0_0_40px_-12px_rgba(14,165,233,0.15)]"
                  : "border-border/50 bg-card hover:border-primary/20"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1">
                    <Zap className="h-3 w-3 text-primary-foreground" />
                    <span className="text-xs font-bold text-primary-foreground">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{plan.employeeRange}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                {plan.priceMonthly === "Custom" ? (
                  <span className="text-3xl font-bold text-foreground font-mono">
                    Let&apos;s Talk
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-foreground font-mono">
                      {annual ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{annual ? "year" : plan.period}
                    </span>
                  </>
                )}
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className={`mt-6 flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-border"
                }`}
              >
                {plan.priceMonthly === "Custom" ? "Contact Us" : "Get Started"}
              </a>

              {/* Divider */}
              <div className="my-6 h-px bg-border/50" />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment note */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            All plans billed via credit card. We accept Visa, MasterCard, and American Express.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary px-3 py-1.5">
              <div className="h-5 w-8 rounded bg-[#635BFF] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#ffffff]">stripe</span>
              </div>
              <span className="text-xs text-muted-foreground">Stripe</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary px-3 py-1.5">
              <div className="h-5 w-8 rounded bg-[#003087] flex items-center justify-center">
                <span className="text-[7px] font-bold text-[#ffffff]">Pay</span>
              </div>
              <span className="text-xs text-muted-foreground">PayPal</span>
            </div>
          </div>
          <p className="mt-2 max-w-lg text-xs text-muted-foreground/60 leading-relaxed">
            * Prices shown do not include applicable taxes. Final pricing may vary depending on
            your location, applicable state and local sales taxes, and any additional services
            requested. You will see the final amount including taxes before confirming your subscription.
          </p>
        </div>
      </div>
    </section>
  )
}
