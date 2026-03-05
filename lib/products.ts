export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  billingType: "yearly" | "monthly"
}

export const PRODUCTS: Product[] = [
  // Starter - Business Contact Page
  {
    id: "starter-yearly",
    name: "SWATech Starter - Business Contact Page (Annual)",
    description: "Professional contact page, corporate email, custom domain, 24/7 online visibility",
    priceInCents: 20000, // $200/year
    billingType: "yearly",
  },
  // Business - Landing Page Pro
  {
    id: "business-monthly",
    name: "SWATech Business - Landing Page Pro (Monthly)",
    description: "Complete landing page with copywriting, design, conversion optimization, analytics",
    priceInCents: 6000, // $60/month
    billingType: "monthly",
  },
  {
    id: "business-yearly",
    name: "SWATech Business - Landing Page Pro (Annual)",
    description: "Complete landing page with copywriting, design, conversion optimization, analytics",
    priceInCents: 60000, // $600/year (save $120)
    billingType: "yearly",
  },
  // PYMES - Business Systems
  {
    id: "pymes-monthly",
    name: "SWATech PYMES - Business Systems (Monthly)",
    description: "Complete management system: CRM, scheduling, inventory, billing, employee management",
    priceInCents: 16900, // $169/month
    billingType: "monthly",
  },
  {
    id: "pymes-yearly",
    name: "SWATech PYMES - Business Systems (Annual)",
    description: "Complete management system: CRM, scheduling, inventory, billing, employee management",
    priceInCents: 169000, // $1,690/year (save ~$338)
    billingType: "yearly",
  },
  // Professional - Advanced Systems
  {
    id: "professional-monthly",
    name: "SWATech Professional - Advanced Systems (Monthly)",
    description: "Scalable solutions with API integrations, multi-location, advanced analytics",
    priceInCents: 39900, // $399/month
    billingType: "monthly",
  },
  {
    id: "professional-yearly",
    name: "SWATech Professional - Advanced Systems (Annual)",
    description: "Scalable solutions with API integrations, multi-location, advanced analytics",
    priceInCents: 399000, // $3,990/year (save ~$798)
    billingType: "yearly",
  },
]
