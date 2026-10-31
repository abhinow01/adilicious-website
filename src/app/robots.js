import { indexingAllowed, siteUrl } from '@/sanity/metadata';

export default function robots() {
  if (!indexingAllowed) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
