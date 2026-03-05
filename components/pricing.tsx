"use client"

import { Check, Zap } from "lucide-react"
import { useState } from "react"
import { Checkout } from "./checkout"

// Map plan names to Stripe product IDs
const PLAN_PRODUCT_IDS: Record<string, { monthly: string; yearly: string }> = {
  "Starter": { monthly: "starter-yearly", yearly: "starter-yearly" }, // Only yearly
  "Business": { monthly: "business-monthly", yearly: "business-yearly" },
  "PYMES": { monthly: "pymes-monthly", yearly: "pymes-yearly" },
  "Professional": { monthly: "professional-monthly", yearly: "professional-yearly" },
}

const plans = [
  {
    name: "Starter",
    subtitle: "Business Contact Page",
    description: "Get your business visible online 24/7. The essentials to be found on the web.",
    priceMonthly: "$200",
    priceYearly: "$200",
    period: "year",
    highlight: false,
    employeeRange: "Solo / Freelancer",
    features: [
      "Professional Contact Page",
      "Google Maps Integration",
      "Corporate Email Setup",
      "Custom Domain (your choice)",
      "Mobile Responsive Design",
      "SSL Security Certificate",
      "Basic SEO Optimization",
      "24/7 Online Visibility",
    ],
  },
  {
    name: "Business",
    subtitle: "Landing Page Pro",
    description: "A complete landing page with copywriting, design, and conversion optimization.",
    priceMonthly: "$60",
    priceYearly: "$600",
    period: "month",
    highlight: false,
    employeeRange: "Small Business",
    features: [
      "Everything in Starter",
      "Professional Copywriting",
      "Custom Design & Branding",
      "Conversion Optimization",
      "Multiple Contact Forms",
      "Google Analytics Setup",
      "Lead Capture System",
      "Monthly Performance Report",
    ],
  },
  {
    name: "PYMES",
    subtitle: "Business Systems",
    description: "Complete management system for growing businesses with 1-10 employees.",
    priceMonthly: "$169",
    priceYearly: "$1,690",
    period: "month",
    highlight: true,
    employeeRange: "1 - 10 employees",
    features: [
      "Everything in Business",
      "Custom Business Dashboard",
      "CRM & Client Management",
      "Appointment Scheduling",
      "Inventory Management",
      "Invoice & Billing System",
      "Employee Management",
      "Priority Email Support",
    ],
  },
  {
    name: "Professional",
    subtitle: "Advanced Systems",
    description: "Scalable solutions for established businesses with complex needs.",
    priceMonthly: "$399",
    priceYearly: "$3,990",
    period: "month",
    highlight: false,
    employeeRange: "10 - 50 employees",
    features: [
      "Everything in PYMES",
      "Custom Software Modules",
      "API Integrations",
      "Multi-location Support",
      "Advanced Analytics & BI",
      "Role-based Access Control",
      "Dedicated Account Manager",
      "Phone & Chat Support",
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [checkoutProduct, setCheckoutProduct] = useState<string | null>(null)

  const handleGetStarted = (planName: string) => {
    const productIds = PLAN_PRODUCT_IDS[planName]
    if (productIds) {
      const productId = annual ? productIds.yearly : productIds.monthly
      setCheckoutProduct(productId)
    }
  }

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
                <p className="mt-0.5 text-xs font-medium text-primary">{plan.subtitle}</p>
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
              <button
                onClick={() => handleGetStarted(plan.name)}
                className={`mt-6 flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-border"
                }`}
              >
                {plan.priceMonthly === "Custom" ? "Contact Us" : "Get Started"}
              </button>

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

      {/* Stripe Checkout Modal */}
      {checkoutProduct && (
        <Checkout 
          productId={checkoutProduct} 
          onClose={() => setCheckoutProduct(null)} 
        />
      )}
    </section>
  )
}
