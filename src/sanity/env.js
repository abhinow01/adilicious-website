import 'server-only'

// Public identifiers (not secrets), but only the server needs them: content is fetched on the
// server and the browser only ever receives finished HTML and image URLs.
export const projectId = process.env.SANITY_PROJECT_ID
export const dataset = process.env.SANITY_DATASET || 'production'

// Pin the API version so a Sanity API change can never alter results unexpectedly.
export const apiVersion = '2026-10-01'

// Secrets: server-only, never prefixed with NEXT_PUBLIC_.
export const readToken = process.env.SANITY_API_READ_TOKEN // Viewer token, drafts preview only
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET // webhook signing secret

// Only for local testing against a mock Content Lake. Leave unset in production.
export const apiHost = process.env.SANITY_API_HOST

// Safety net in case a publish webhook is ever missed: cached content is re-checked at most
// once per hour, and only when a visitor actually requests the page.
export const REVALIDATE_FALLBACK_SECONDS = 3600

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID. Copy .env.example to .env.local and fill it in.')
}
