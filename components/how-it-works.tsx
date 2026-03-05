import { MessageSquare, Paintbrush, Rocket, Headphones } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Discovery Call",
    description:
      "We sit down (virtually or in person) to understand your business, your goals, and what you need. No tech jargon, just conversation.",
  },
  {
    icon: Paintbrush,
    number: "02",
    title: "Design & Prototype",
    description:
      "We build a preview of your solution so you can see it and feel it before we write a single line of final code.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Build & Launch",
    description:
      "Once approved, we develop, test, and deploy your solution. You get a live product, ready for your customers.",
  },
  {
    icon: Headphones,
    number: "04",
    title: "Ongoing Support",
    description:
      "We don't disappear after launch. Your plan includes maintenance, updates, and direct support whenever you need it.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.04),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Our Process
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl font-mono text-balance">
            From idea to live product in 4 simple steps
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-primary/30 to-transparent lg:block" />
              )}

              <div className="flex flex-col items-start">
                <div className="relative mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
