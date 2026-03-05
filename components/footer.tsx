export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top row */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground font-mono">SW</span>
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              SWA<span className="text-primary">Tech</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Services", "How It Works", "Pricing", "FAQ", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-border/50" />

        {/* Disclaimer */}
        <div className="flex flex-col gap-4 text-center">
          <p className="mx-auto max-w-3xl text-[11px] leading-relaxed text-muted-foreground/50">
            <span className="font-semibold text-muted-foreground/70">Disclaimer:</span>{" "}
            SWATech provides custom web development and digital solutions services. All prices
            displayed on this website are estimates and do not include applicable federal, state,
            or local taxes. Final pricing may vary based on project scope, additional features
            requested, applicable taxes, and other factors. Services are subject to our terms
            and conditions. SWATech reserves the right to modify pricing, features, and
            availability at any time without prior notice. Results and timelines may vary
            depending on the complexity and requirements of each project. SWATech is not
            responsible for third-party services, including but not limited to domain registrars,
            email hosting providers, and payment processors.
          </p>

          <p className="mx-auto max-w-2xl text-[11px] leading-relaxed text-muted-foreground/50">
            SWATech is a boutique digital agency based in Tampa, Florida. All services are
            provided under individual service agreements. By engaging our services you agree
            to the terms outlined in your specific service contract.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-border/50" />

        {/* Copyright row */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SWATech. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Refund Policy
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground/40">
            Tampa, FL | Serving clients nationwide
          </p>
        </div>
      </div>
    </footer>
  )
}
