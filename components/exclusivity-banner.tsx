import { Shield, Users, Clock } from "lucide-react"

export function ExclusivityBanner() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-10 lg:p-14">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Boutique Agency
              </span>
            </div>

            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl font-mono text-balance">
              We work with a select few clients
              <span className="text-primary">{" "}so we can deliver the best.</span>
            </h2>

            <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
              Unlike large agencies that juggle hundreds of accounts, SWATech is a boutique
              studio that intentionally limits our client roster. This means your project gets
              our full attention, faster turnaround, and a level of care that bigger firms
              simply cannot match.
            </p>

            {/* Value props */}
            <div className="mt-10 grid w-full gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Limited Roster</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  We take on a limited number of clients at a time to ensure quality over quantity.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Fast Response</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  No ticket queues. You talk directly with the people building your product.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Dedicated Team</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  Your project is never handed off. The same team from kickoff to launch and beyond.
                </p>
              </div>
            </div>

            {/* Urgency CTA */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                href="#contact"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Secure Your Spot
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
              <p className="text-xs text-muted-foreground">
                Availability is limited. Don&apos;t miss the opportunity to work with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
