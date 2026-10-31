import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'
import {validatePreviewUrl} from '@sanity/preview-url-secret'
import {client} from '@/sanity/client'
import {readToken} from '@/sanity/env'

/**
 * Opened by the Sanity Studio's Presentation tool. The Studio creates a short-lived secret in the
 * dataset; we verify it with the server-side Viewer token, so only signed-in editors can turn on
 * draft mode. Only a relative path is accepted as the redirect target (no open redirects).
 */
export async function GET(request) {
  if (!readToken) {
    return new Response('Preview is not configured (SANITY_API_READ_TOKEN missing)', {status: 500})
  }

  const {isValid, redirectTo = '/'} = await validatePreviewUrl(
    client.withConfig({token: readToken}),
    request.url,
  )
  if (!isValid) return new Response('Invalid preview secret', {status: 401})

  ;(await draftMode()).enable()
  redirect(redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/')
}
