import "./globals.css";

export const metadata = {
  title: "Adilicious — An ad agency that thinks like a restaurant",
  description: "An ad agency that thinks like a restaurant. Shadipur meets Karampura, est. 2026.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
