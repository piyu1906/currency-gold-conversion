import { Metadata } from 'next';
import './globals.css'; // Assuming you have a global CSS file

// Define static fallback SEO data
const defaultSeo = {
  metaTitle: 'Currency & Gold Conversion | NorthFox Group',
  metaDescription:
    'Convert international currencies and gold prices with real-time rates on NorthFox Group’s Currency & Gold Conversion platform.',
  keywords: 'currency converter, gold price converter, exchange rates, NorthFox Group, real-time currency conversion',
  metaImage: 'https://currency-convertor.nfgprojects.in/og-image.png',
};

// Export metadata for SEO
export const metadata: Metadata = {
  title: defaultSeo.metaTitle,
  description: defaultSeo.metaDescription,
  keywords: defaultSeo.keywords,
  authors: [{ name: 'NorthFox Group', url: 'https://x.com/princu09' }],
  creator: 'NorthFox Group',
  publisher: 'NorthFox Group',
  robots: 'index, follow',
  twitter: {
    card: 'summary_large_image',
    title: defaultSeo.metaTitle,
    description: defaultSeo.metaDescription,
    site: 'currency-convertor.nfgprojects.in',
    creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR || '@northfoxgroup',
    creatorId: process.env.NEXT_PUBLIC_TWITTER_CREATOR_ID || 'princu09',
    images: [defaultSeo.metaImage],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://currency-convertor.nfgprojects.in',
    siteName: 'NorthFox Group',
    title: defaultSeo.metaTitle,
    description: defaultSeo.metaDescription,
    emails: [process.env.NEXT_PUBLIC_EMAIL || 'info@northfoxgroup.com'],
    phoneNumbers: [process.env.NEXT_PUBLIC_PHONE || '+91 9033717372'],
    countryName: 'India',
    images: [
      {
        url: defaultSeo.metaImage,
        width: 1200,
        height: 630,
        alt: 'Currency & Gold Conversion - NorthFox Group',
      },
    ],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://currency-convertor.nfgprojects.in',
  },
  viewport: 'width=device-width, initial-scale=1.0',
};

// Root Layout Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}