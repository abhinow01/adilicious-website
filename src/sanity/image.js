// Client-safe helpers for Sanity images. Images are served by Sanity's image CDN, which
// resizes and converts them on the fly, so the website server does no image processing.

const SANITY_CDN = 'https://cdn.sanity.io/'

export const isSanityImage = (src) => typeof src === 'string' && src.startsWith(SANITY_CDN)

/** next/image loader: asks the Sanity CDN for the exact width needed, in WebP/AVIF. */
export function sanityImageLoader({src, width, quality}) {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality || 75))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  return url.toString()
}

/**
 * A fixed-size URL respecting the editor's crop and hotspot. Used where an `<img srcset>` isn't
 * possible: video posters and social-sharing images.
 */
export function sanityImageUrl(image, {width, height, quality = 75} = {}) {
  if (!image?.url) return undefined
  const url = new URL(image.url)
  if (width) url.searchParams.set('w', String(width))
  if (height) url.searchParams.set('h', String(height))
  if (width && height) {
    url.searchParams.set('fit', 'crop')
    if (image.hotspot) {
      url.searchParams.set('crop', 'focalpoint')
      url.searchParams.set('fp-x', image.hotspot.x.toFixed(3))
      url.searchParams.set('fp-y', image.hotspot.y.toFixed(3))
    }
  }
  if (image.crop && image.width && image.height) {
    const {top = 0, bottom = 0, left = 0, right = 0} = image.crop
    const x = Math.round(left * image.width)
    const y = Math.round(top * image.height)
    const w = Math.round((1 - left - right) * image.width)
    const h = Math.round((1 - top - bottom) * image.height)
    if (w > 0 && h > 0 && (x || y || w !== image.width || h !== image.height)) {
      url.searchParams.set('rect', `${x},${y},${w},${h}`)
    }
  }
  url.searchParams.set('q', String(quality))
  url.searchParams.set('auto', 'format')
  return url.toString()
}
