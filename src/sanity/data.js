import 'server-only'
import {cache} from 'react'
import {sanityFetch} from './fetch'
import {HOME_QUERY, ROUTED_DOCUMENTS_QUERY, SETTINGS_QUERY} from './queries'
import {ROUTED_TYPES} from './routes'
import {TAGS} from './tags'

// React `cache` makes each loader run once per request, even though the layout, the page and
// generateMetadata all ask for the same data.

export const getSiteSettings = cache(async () => {
  const settings = await sanityFetch({query: SETTINGS_QUERY, tags: [TAGS.siteSettings]})
  if (!settings) {
    throw new Error('Sanity has no "siteSettings" document. Run the seed script in /studio (see CMS.md).')
  }
  return settings
})

export const getHomePage = cache(async () => {
  const home = await sanityFetch({
    query: HOME_QUERY,
    tags: [TAGS.homePage, TAGS.course, TAGS.work],
  })
  if (!home) {
    throw new Error('Sanity has no "homePage" document. Run the seed script in /studio (see CMS.md).')
  }
  return home
})

export const getRoutedDocuments = cache(async () => {
  if (!ROUTED_TYPES.length) return []
  return sanityFetch({
    query: ROUTED_DOCUMENTS_QUERY,
    params: {types: ROUTED_TYPES},
    tags: ROUTED_TYPES,
  })
})
