export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
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

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} SWATech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
