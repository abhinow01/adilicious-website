import 'server-only'
import {draftMode} from 'next/headers'
import {client} from './client'
import {readToken, REVALIDATE_FALLBACK_SECONDS} from './env'

/**
 * The only way the site reads from Sanity.
 *
 * Public visitors: the result is stored in the Next.js Data Cache with cache tags. The page is
 * prerendered from it, so visitors never wait on Sanity. When an editor publishes, the Sanity
 * webhook calls /api/revalidate, which expires the matching tags, and the next request renders
 * fresh content once and caches it again.
 *
 * Draft mode (editors previewing from the Studio): uncached, authenticated with a server-side
 * Viewer token, reading drafts. The token never reaches the browser.
 *
 * @param {{query: string, params?: Record<string, unknown>, tags: string[]}} options
 */
export async function sanityFetch({query, params = {}, tags}) {
  const {isEnabled: isDraft} = await draftMode()

  if (isDraft) {
    if (!readToken) throw new Error('Draft mode needs SANITY_API_READ_TOKEN')
    return client
      .withConfig({token: readToken, perspective: 'drafts', useCdn: false})
      .fetch(query, params, {cache: 'no-store'})
  }

  return client.fetch(query, params, {
    cache: 'force-cache',
    next: {tags, revalidate: REVALIDATE_FALLBACK_SECONDS},
  })
}
