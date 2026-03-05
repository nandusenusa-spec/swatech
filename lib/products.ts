export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  billingType: "yearly" | "monthly"
}

export const PRODUCTS: Product[] = [
  {
    id: "starter-yearly",
    name: "SWATech Starter Plan (Annual)",
    description: "Custom landing page, contact form, corporate email, and domain setup",
    priceInCents: 20000, // $200/year
    billingType: "yearly",
  },
  {
    id: "business-monthly",
    name: "SWATech Business Plan (Monthly)",
    description: "Complete business dashboard with CRM, scheduling, inventory, and reports",
    priceInCents: 9900, // $99/month
    billingType: "monthly",
  },
  {
    id: "business-yearly",
    name: "SWATech Business Plan (Annual)",
    description: "Complete business dashboard with CRM, scheduling, inventory, and reports",
    priceInCents: 99000, // $990/year (save ~$200)
    billingType: "yearly",
  },
  {
    id: "professional-monthly",
    name: "SWATech Professional Plan (Monthly)",
    description: "Advanced integrations, multi-location support, dedicated account manager",
    priceInCents: 19900, // $199/month
    billingType: "monthly",
  },
  {
    id: "professional-yearly",
    name: "SWATech Professional Plan (Annual)",
    description: "Advanced integrations, multi-location support, dedicated account manager",
    priceInCents: 199000, // $1,990/year (save ~$400)
    billingType: "yearly",
  },
]
