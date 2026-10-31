// Which Sanity document types have their own page, and at what path.
// Empty today: the site is a single page. When case-study or blog pages are added, add the type
// here (e.g. `work: (slug) => `/work/${slug}``) and the sitemap and links pick it up.
export const DOCUMENT_ROUTES = {
  // work: (slug) => `/work/${slug}`,
  // post: (slug) => `/blog/${slug}`,
}

export const ROUTED_TYPES = Object.keys(DOCUMENT_ROUTES)

export function resolveHref(type, slug) {
  const route = DOCUMENT_ROUTES[type]
  return route && slug ? route(slug) : null
}
