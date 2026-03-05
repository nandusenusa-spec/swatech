"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { FadeInSection } from "@/hooks/use-scroll-animation"

const faqs = [
  {
    question: "What is included in the Starter plan?",
    answer:
      "The Starter plan includes a fully custom landing page, a contact form that sends leads directly to your email, a professional corporate email address (e.g. you@yourbusiness.com), your own custom domain, SSL security, and basic analytics to track visitors.",
  },
  {
    question: "How long does it take to build my website or system?",
    answer:
      "A simple landing page can be ready in as little as 5-7 business days. More complex systems like dashboards and CRM tools typically take 3-6 weeks depending on the features you need. We always provide a timeline before starting.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Absolutely. You can upgrade at any time. We'll migrate all your existing data and configurations to the new plan seamlessly. You only pay the difference for the remainder of your billing cycle.",
  },
  {
    question: "Do you offer custom solutions beyond the listed plans?",
    answer:
      "Yes. Our Enterprise plan is fully customizable. If you need HIPAA compliance, on-premise deployments, custom API integrations, or anything specific to your industry, we'll build it. Contact us for a personalized quote.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) through Stripe and PayPal. All plans are billed monthly or annually with no hidden fees.",
  },
  {
    question: "Are taxes included in the listed prices?",
    answer:
      "No. All prices shown on our website are before applicable taxes. Depending on your location, state and local sales taxes may apply. You will always see the final amount including any applicable taxes before confirming your subscription. We provide a full invoice breakdown with every payment.",
  },
  {
    question: "Why do you limit the number of clients?",
    answer:
      "We are a boutique agency by choice. By keeping our client roster intentionally small, we guarantee that every project receives our complete focus and attention. This means faster response times, higher quality output, and a true partnership rather than being just another account number.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel at any time. Your service will remain active until the end of your current billing period. We can also export your data if you need it. No lock-in contracts.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Every plan includes ongoing support. Starter plans get email support, Business and Professional plans get priority support, and Enterprise clients get a dedicated account manager with 24/7 availability.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.04),transparent_70%)]" />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl font-mono text-balance">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FadeInSection key={index} delay={index * 50}>
              <div
                className="rounded-xl border border-border/50 bg-card transition-all hover:border-primary/20 hover:shadow-lg"
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4 text-sm font-medium text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}>
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}
