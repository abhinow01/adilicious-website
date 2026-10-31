import { draftMode } from 'next/headers';
import HomeClient from '@/components/HomeClient';
import { getHomePage, getSiteSettings } from '@/sanity/data';
import { buildMetadata } from '@/sanity/metadata';

// Server Component: fetches the content (from the Next.js cache, see src/sanity/fetch.js) and
// renders the interactive page with it. The page is prerendered as static HTML and only
// re-rendered when an editor publishes.

export async function generateMetadata() {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  return buildMetadata({ seo: home.seo, settings, path: '/' });
}

export default async function Page() {
  const [home, settings, draft] = await Promise.all([getHomePage(), getSiteSettings(), draftMode()]);
  // Pass only what the page renders: everything passed to a Client Component is serialized
  // into the HTML.
  const { seo, _updatedAt, ...content } = home;
  const { siteName, tagline, contacts } = settings;
  return <HomeClient home={content} settings={{ siteName, tagline, contacts }} isDraftMode={draft.isEnabled} />;
}
