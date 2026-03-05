import { MetadataRoute } from 'next'

// Sitemap auto-generates with current dates
// Google recommends updating sitemaps when content changes
// This dynamic sitemap always shows fresh lastModified dates

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://swatech.dev' // Update with your actual domain
  const currentDate = new Date()
  
  // Update every 48 hours by using modular date
  const lastMod = new Date(
    Math.floor(currentDate.getTime() / (48 * 60 * 60 * 1000)) * (48 * 60 * 60 * 1000)
  )

  return [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fleet`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/driver`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
