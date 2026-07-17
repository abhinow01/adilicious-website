import localFont from 'next/font/local';
import './globals.css';

export const metadata = {
  title: "Adilicious — An ad agency that thinks like a restaurant",
  description: "An ad agency that thinks like a restaurant. Shadipur meets Karampura, est. 2026.",
};

const helveticaNeue = localFont({
  src: [
    // --- 100: Ultra Light ---
    {
      path: './fonts/HelveticaNeueUltraLight.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueUltraLightItalic.otf',
      weight: '100',
      style: 'italic',
    },
    // --- 200: Thin ---
    {
      path: './fonts/HelveticaNeueThin.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueThinItalic.otf',
      weight: '200',
      style: 'italic',
    },
    // --- 300: Light ---
    {
      path: './fonts/HelveticaNeueLight.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueLightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    // --- 400: Regular / Roman ---
    {
      path: './fonts/HelveticaNeueRoman.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueItalic.ttf', // Note: This file is a .ttf
      weight: '400',
      style: 'italic',
    },
    // --- 500: Medium ---
    {
      path: './fonts/HelveticaNeueMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueMediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    // --- 700: Bold ---
    {
      path: './fonts/HelveticaNeueBold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueBoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    // --- 800: Heavy ---
    {
      path: './fonts/HelveticaNeueHeavy.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueHeavyItalic.otf',
      weight: '800',
      style: 'italic',
    },
    // --- 900: Black ---
    {
      path: './fonts/HelveticaNeueBlack.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/HelveticaNeueBlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-helvetica',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${helveticaNeue.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}