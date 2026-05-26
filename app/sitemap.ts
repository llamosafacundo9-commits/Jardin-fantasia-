import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/galeria`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
