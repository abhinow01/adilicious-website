import 'server-only'
import {createClient} from '@sanity/client'
import {apiHost, apiVersion, dataset, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Bypass Sanity's API CDN on purpose. Next.js already caches every response, so we query
  // Sanity only after a publish. Reading through the CDN right after a publish could return
  // the previous version, which Next.js would then keep until the next publish.
  useCdn: false,
  perspective: 'published',
  ...(apiHost ? {apiHost, useProjectHostname: false} : {}),
})
