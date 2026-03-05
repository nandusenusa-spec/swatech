"use client"

import { Send, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left side - info */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Get In Touch
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl font-mono text-balance">
              Ready to bring your business online?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Schedule a free consultation. We&apos;ll discuss your needs, show you
              what&apos;s possible, and put together a plan that fits your budget.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Tampa, FL 33603</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a href="mailto:info@swatworks.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    info@swatworks.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a href="tel:+18132491241" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    (813) 249-1241
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - form */}
          <div className="rounded-xl border border-border/50 bg-card p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="flex flex-col gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Smith"
                      className="rounded-lg border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      className="rounded-lg border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Your Business LLC"
                    className="rounded-lg border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="plan" className="text-sm font-medium text-foreground">
                    Interested Plan
                  </label>
                  <select
                    id="plan"
                    className="rounded-lg border border-input bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a plan
                    </option>
                    <option value="starter">Starter - $200/year</option>
                    <option value="business">Business - $99/month</option>
                    <option value="professional">Professional - $199/month</option>
                    <option value="enterprise">Enterprise - Custom</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe what you need..."
                    className="resize-none rounded-lg border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
