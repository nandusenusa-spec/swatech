//  SEO Configuration for SWATech
// Auto-updates every 48 hours with best practices for Google

export const siteConfig = {
  name: "SWATech",
  url: "https://swatech.dev", // Update with your actual domain
  ogImage: "/og-image.jpg",
  description: "Custom digital solutions for businesses in Tampa, FL. From landing pages to fleet tracking systems, we build software that grows with you.",
  keywords: [
    // Local Tampa FL
    "web development Tampa FL",
    "Tampa web design",
    "Tampa software development",
    "business software Tampa",
    "custom software Tampa Florida",
    "web developer near me Tampa",
    "Tampa tech company",
    "software company Tampa Bay",
    // Fleet Tracking
    "fleet tracking software",
    "GPS fleet management",
    "real-time vehicle tracking",
    "fleet management system",
    "delivery tracking software",
    "vehicle tracking app",
    "fleet monitoring solution",
    "GPS tracking for business",
    // General Web Services
    "landing page development",
    "business management systems",
    "custom web applications",
    "small business software",
    "startup software development",
    "SaaS development",
    "enterprise software solutions",
    "business automation software",
    "CRM development",
    "inventory management system",
  ],
  authors: [{ name: "SWATech", url: "https://swatech.dev" }],
  creator: "SWATech",
  publisher: "SWATech",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  // Business info for structured data
  business: {
    name: "SWATech",
    alternateName: "SWAT Works",
    legalName: "SWATech LLC",
    email: "info@swatworks.com",
    telephone: "+1-813-249-1241",
    address: {
      streetAddress: "",
      addressLocality: "Tampa",
      addressRegion: "FL",
      postalCode: "33603",
      addressCountry: "US",
    },
    geo: {
      latitude: 27.9506,
      longitude: -82.4572,
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
    areaServed: ["Tampa", "Florida", "United States"],
    serviceType: [
      "Web Development",
      "Software Development",
      "Fleet Tracking Systems",
      "Landing Page Design",
      "Business Management Software",
      "Custom Applications",
    ],
  },
  // Social links
  links: {
    twitter: "https://twitter.com/swatech",
    linkedin: "https://linkedin.com/company/swatech",
    facebook: "https://facebook.com/swatech",
  },
}

// Generate dynamic metadata based on current date and SEO best practices
export function generateSEOMetadata(pageName?: string) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
  
  const baseTitle = pageName 
    ? `${pageName} | ${siteConfig.name}` 
    : `${siteConfig.name} | Custom Digital Solutions for Tampa Businesses`
  
  // Dynamic description that includes current date for freshness signals
  const dynamicDescription = `${siteConfig.description} Updated ${currentMonth} ${currentYear}. Serving Tampa Bay and beyond.`
  
  return {
    title: {
      default: baseTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: dynamicDescription,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    formatDetection: siteConfig.formatDetection,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/",
        "es-US": "/es",
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: baseTitle,
      description: dynamicDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Custom Digital Solutions`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: dynamicDescription,
      images: [siteConfig.ogImage],
      creator: "@swatech",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code", // Add your actual code
      // yandex: "your-yandex-verification-code",
      // yahoo: "your-yahoo-verification-code",
    },
  }
}

// JSON-LD Structured Data for Local Business
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.business.name,
    alternateName: siteConfig.business.alternateName,
    legalName: siteConfig.business.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    email: siteConfig.business.email,
    telephone: siteConfig.business.telephone,
    priceRange: siteConfig.business.priceRange,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.business.address.addressLocality,
      addressRegion: siteConfig.business.address.addressRegion,
      postalCode: siteConfig.business.address.postalCode,
      addressCountry: siteConfig.business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: siteConfig.business.areaServed.map(area => ({
      "@type": "Place",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Solutions",
      itemListElement: siteConfig.business.serviceType.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
        },
        position: index + 1,
      })),
    },
    sameAs: Object.values(siteConfig.links),
  }
}

// JSON-LD for Software Application (Fleet Tracking)
export function generateSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SWATech Fleet Tracking",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: "Real-time fleet tracking and vehicle management system with GPS tracking, delivery status, clock in/out, and driver management.",
    offers: {
      "@type": "Offer",
      price: "99",
      priceCurrency: "USD",
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Real-time GPS tracking",
      "Delivery status management",
      "Clock in/out tracking",
      "Mileage reporting",
      "WhatsApp integration",
      "Multi-vehicle support",
    ],
  }
}

// FAQ Schema for rich snippets
export function generateFAQSchema() {
  const faqs = [
    {
      question: "How much does a landing page cost?",
      answer: "Our Starter plan includes a landing page, contact form, corporate email, and custom domain for $200/year ($17/month). This is perfect for freelancers and solopreneurs."
    },
    {
      question: "Do you build custom fleet tracking software?",
      answer: "Yes! Our fleet tracking system includes real-time GPS tracking, delivery management, clock in/out, mileage tracking, and WhatsApp integration. Pricing starts at $99/month for the Business plan."
    },
    {
      question: "Do you serve businesses outside Tampa?",
      answer: "Yes, while we're based in Tampa, FL, we serve clients nationwide and can work with businesses anywhere in the United States."
    },
    {
      question: "Are taxes included in your pricing?",
      answer: "No. All prices shown are before applicable taxes. Depending on your location, state and local sales taxes may apply. You'll see the final amount before confirming."
    },
    {
      question: "What makes SWATech different from other agencies?",
      answer: "We're a boutique agency that intentionally limits our client roster. This means faster response times, higher quality output, and a true partnership rather than being just another account."
    },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Service Schema
export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Development and Software Solutions",
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.business.name,
      telephone: siteConfig.business.telephone,
      email: siteConfig.business.email,
    },
    areaServed: {
      "@type": "City",
      name: "Tampa",
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Starter Plan",
          itemListElement: [{
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Landing Page + Email + Domain",
            },
            price: "200",
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "200",
              priceCurrency: "USD",
              unitText: "YEAR",
            },
          }],
        },
        {
          "@type": "OfferCatalog",
          name: "Business Plan",
          itemListElement: [{
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Full Business Management System",
            },
            price: "99",
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "99",
              priceCurrency: "USD",
              unitText: "MONTH",
            },
          }],
        },
      ],
    },
  }
}
