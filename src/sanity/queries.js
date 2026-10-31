// Every GROQ query the site runs lives in this file. Each query asks for exactly the fields the
// page renders, and references (courses, work) are resolved inside the same query, so a page
// needs one round trip per document: no waterfalls.

const imageFields = /* groq */ `
  alt,
  hotspot,
  crop,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
`

const seoFields = /* groq */ `
  title,
  description,
  noIndex,
  image{ ${imageFields} }
`

export const SETTINGS_QUERY = /* groq */ `
*[_id == "siteSettings"][0]{
  _updatedAt,
  siteName,
  tagline,
  contacts[]{ label, email },
  seo{ ${seoFields} },
  organization{
    legalName, email, telephone, locality, postalCode, country, sameAs,
    logo{ ${imageFields} }
  },
  footer{
    tagline,
    columns[]{ heading, links[]{ label, href } },
    copyright,
    signoff
  }
}`

export const HOME_QUERY = /* groq */ `
*[_id == "homePage"][0]{
  _updatedAt,
  hero{
    reelLabel,
    slides[]{
      _key, tag, title, client, role,
      "videoSrc": coalesce(videoUrl, video.asset->url),
      poster{ ${imageFields} }
    }
  },
  ticker,
  manifesto{ eyebrow, text, signature },
  menu{
    eyebrow, title, markerLabel,
    courses[]->{ _id, name, label, description },
    posters[]->{ _id, client, posterArt, posterImage{ ${imageFields} } }
  },
  reservation{ eyebrow, title, body, form },
  hello{ smallWords, bigWord, subline, postcard, thanks },
  seo{ ${seoFields} }
}`

// Slugs of document types that have their own pages (see routes.js). Used by the sitemap.
export const ROUTED_DOCUMENTS_QUERY = /* groq */ `
*[_type in $types && defined(slug.current) && seo.noIndex != true]{
  _type, _updatedAt, "slug": slug.current
}`
