import localFont from 'next/font/local';
import { getSiteSettings } from '@/sanity/data';
import { buildJsonLd, buildMetadata, siteUrl } from '@/sanity/metadata';
import './globals.css';

// Site-wide metadata defaults (pages override with their own SEO fields).
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(siteUrl),
    applicationName: settings.siteName,
    ...buildMetadata({ seo: null, settings }),
  };
}

// Only the six faces the design actually renders (measured with the browser's computed styles),
// converted to WOFF2 and limited to Latin characters, punctuation and common symbols:
// ~340 KB instead of 16 OTF faces (6.6 MB). Source files and the regeneration script are in
// assets/fonts-source/.
const helveticaNeue = localFont({
  src: [
    { path: './fonts/HelveticaNeueLight.woff2', weight: '300', style: 'normal' },
    { path: './fonts/HelveticaNeueRoman.woff2', weight: '400', style: 'normal' },
    { path: './fonts/HelveticaNeueItalic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/HelveticaNeueMedium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/HelveticaNeueBold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/HelveticaNeueBlack.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-helvetica',
  display: 'swap',
});

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  // JSON-LD is escaped so content from the CMS can't break out of the script tag.
  const jsonLd = JSON.stringify(buildJsonLd(settings)).replace(/</g, '\\u003c');
  return (
    <html lang="en" className={`${helveticaNeue.variable}`}>
      <body className="antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}