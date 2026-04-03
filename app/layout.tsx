import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cakish — Premium Handcrafted Pavlova | Wicklow, Ireland",
    template: "%s | Cakish.ie",
  },
  description:
    "Cakish creates premium handcrafted pavlova desserts in Wicklow, Ireland. Made fresh to order for birthdays, communions, and elegant celebrations. Choose your size and finish — collection from Wicklow.",
  keywords: [
    "pavlova",
    "pavlova Ireland",
    "pavlova Wicklow",
    "pavlova Dublin",
    "custom pavlova",
    "birthday pavlova",
    "celebration cake Ireland",
    "meringue dessert",
    "handcrafted dessert Ireland",
    "Cakish",
    "premium dessert Wicklow",
    "pavlova near me",
    "order pavlova online Ireland",
  ],
  metadataBase: new URL("https://cakish.ie"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://cakish.ie",
    siteName: "Cakish",
    title: "Cakish — Premium Handcrafted Pavlova | Wicklow, Ireland",
    description:
      "Made fresh to order for birthdays, communions, and elegant celebrations. Choose your size and finish — collection from Wicklow.",
    images: [
      {
        url: "/images/hero-pavlova.jpeg",
        width: 1200,
        height: 630,
        alt: "The Cakish Modern Pavlova with strawberry floral finish",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cakish — Premium Handcrafted Pavlova | Wicklow, Ireland",
    description:
      "Made fresh to order. Choose your size and finish — collection from Wicklow, Ireland.",
    images: ["/images/hero-pavlova.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "IE-WW",
    "geo.placename": "Wicklow, Ireland",
    "geo.position": "53.0;-6.05",
    ICBM: "53.0, -6.05",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Cakish",
  url: "https://cakish.ie",
  image: "https://cakish.ie/images/hero-pavlova.jpeg",
  description:
    "Premium handcrafted pavlova desserts made fresh to order for birthdays, communions, and elegant celebrations.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Wicklow",
    addressRegion: "County Wicklow",
    addressCountry: "IE",
  },
  areaServed: [
    { "@type": "Place", name: "Wicklow" },
    { "@type": "Place", name: "Dublin" },
    { "@type": "Place", name: "Ireland" },
  ],
  priceRange: "€48–€130",
  servesCuisine: "Dessert",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pavlova Menu",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: 'The Cakish Modern Pavlova — 6"',
          description: "Perfect for intimate tables and smaller celebrations.",
        },
        priceCurrency: "EUR",
        price: "48",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: 'The Cakish Modern Pavlova — 8"',
          description: "A balanced centrepiece for most family occasions.",
        },
        priceCurrency: "EUR",
        price: "68",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: 'The Cakish Modern Pavlova — 12"',
          description: "Created for larger tables and bigger moments.",
        },
        priceCurrency: "EUR",
        price: "112",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
