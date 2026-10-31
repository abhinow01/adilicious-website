import {revalidateTag} from 'next/cache'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {revalidateSecret} from '@/sanity/env'
import {ALL_TAGS} from '@/sanity/tags'

/**
 * Called by a Sanity GROQ-powered webhook whenever content is published, unpublished or deleted.
 * Webhook projection: {"tags": [_type]}  (see CMS.md for the full webhook settings)
 *
 * `expire: 0` makes the very next request render fresh content (one blocking render, then it is
 * cached again). We prefer that over the 'max' profile (stale-while-revalidate), where the first
 * visitor after a publish would still see the old version: confusing for an editor checking
 * their change.
 */
export async function POST(request) {
  if (!revalidateSecret) {
    return Response.json({message: 'SANITY_REVALIDATE_SECRET is not set'}, {status: 500})
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  const body = await request.text()
  if (!signature || !(await isValidSignature(body, signature, revalidateSecret))) {
    return Response.json({message: 'Invalid signature'}, {status: 401})
  }

  let payload
  try {
    payload = JSON.parse(body)
  } catch {
    return Response.json({message: 'Invalid JSON'}, {status: 400})
  }

  const requested = Array.isArray(payload?.tags) ? payload.tags : [payload?._type]
  const tags = requested.filter((tag) => typeof tag === 'string' && ALL_TAGS.has(tag))
  if (!tags.length) {
    return Response.json({message: 'No known tags in payload', requested}, {status: 400})
  }

  for (const tag of tags) revalidateTag(tag, {expire: 0})
  return Response.json({revalidated: tags, now: Date.now()})
}
