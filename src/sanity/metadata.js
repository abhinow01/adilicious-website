import 'server-only'
import {sanityImageUrl} from './image'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

// Set SITE_NOINDEX=1 on a staging copy so it never competes with the real site in search.
export const indexingAllowed = process.env.SITE_NOINDEX !== '1'

const OG = {width: 1200, height: 630}

/**
 * Page metadata = page SEO fields, falling back to Site settings defaults, so no page ever ships
 * an empty title or description.
 */
export function buildMetadata({seo, settings, path = '/'}) {
  const defaults = settings?.seo ?? {}
  const title = seo?.title || defaults.title || settings?.siteName
  const description = seo?.description || defaults.description
  const image = seo?.image?.url ? seo.image : defaults.image
  const imageUrl = sanityImageUrl(image, OG)
  const images = imageUrl ? [{url: imageUrl, ...OG, alt: image?.alt || title}] : undefined
  const noIndex = !indexingAllowed || seo?.noIndex || false

  return {
    title,
    description,
    alternates: {canonical: path},
    openGraph: {
      type: 'website',
      url: path,
      siteName: settings?.siteName,
      title,
      description,
      locale: 'en_IN',
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: noIndex ? {index: false, follow: false} : {index: true, follow: true},
  }
}

/** schema.org data describing the agency. Only fields that are actually filled in are emitted. */
export function buildJsonLd(settings) {
  const org = settings?.organization ?? {}
  const logo = sanityImageUrl(org.logo, {width: 512})
  const address =
    org.locality || org.postalCode || org.country
      ? clean({
          '@type': 'PostalAddress',
          addressLocality: org.locality,
          postalCode: org.postalCode,
          addressCountry: org.country,
        })
      : undefined

  return {
    '@context': 'https://schema.org',
    '@graph': [
      clean({
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: settings?.siteName,
        legalName: org.legalName,
        description: settings?.tagline,
        url: `${siteUrl}/`,
        logo,
        email: org.email,
        telephone: org.telephone,
        address,
        sameAs: org.sameAs?.length ? org.sameAs : undefined,
      }),
      clean({
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: settings?.siteName,
        description: settings?.seo?.description,
        publisher: {'@id': `${siteUrl}/#organization`},
        inLanguage: 'en',
      }),
    ],
  }
}

function clean(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''))
}
