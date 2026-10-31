import { getHomePage, getRoutedDocuments, getSiteSettings } from '@/sanity/data';
import { siteUrl } from '@/sanity/metadata';
import { resolveHref } from '@/sanity/routes';

// Built from the CMS and refreshed by the same publish webhook as the pages.
// Future case-study / blog pages appear here automatically once added to src/sanity/routes.js.
export default async function sitemap() {
  const [home, settings, documents] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getRoutedDocuments(),
  ]);

  const homeModified = [home._updatedAt, settings._updatedAt].filter(Boolean).sort().at(-1);
  const entries = [
    { url: `${siteUrl}/`, lastModified: homeModified, changeFrequency: 'monthly', priority: 1 },
  ];

  for (const doc of documents) {
    const href = resolveHref(doc._type, doc.slug);
    if (href) entries.push({ url: `${siteUrl}${href}`, lastModified: doc._updatedAt, priority: 0.7 });
  }
  return entries;
}
