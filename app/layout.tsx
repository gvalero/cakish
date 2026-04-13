import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cakish — Handcrafted Pavlova | Wicklow, Ireland",
    template: "%s | Cakish",
  },
  description:
    "Cakish creates handcrafted pavlova desserts in Wicklow, Ireland. Choose from Strawberry, Heart, Mixed Berries, or Raspberry Pavlova with Dulce de Leche or Nutella filling. Made fresh to order for birthdays, communions, and celebrations. Collection from Wicklow.",
  keywords: [
    "pavlova",
    "pavlova Ireland",
    "pavlova Wicklow",
    "pavlova Dublin",
    "strawberry pavlova",
    "raspberry pavlova",
    "mixed berries pavlova",
    "heart pavlova",
    "custom pavlova",
    "birthday pavlova Ireland",
    "communion dessert Ireland",
    "meringue dessert",
    "handcrafted dessert Ireland",
    "Cakish",
    "pavlova near me",
    "order pavlova online Ireland",
    "dulce de leche pavlova",
    "nutella pavlova",
    "pavlova delivery Wicklow",
    "celebration cake Ireland",
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
    title: "Cakish — Handcrafted Pavlova | Wicklow, Ireland",
    description:
      "Four handcrafted pavlova varieties — Strawberry, Heart, Mixed Berries, Raspberry. Dulce de Leche or Nutella filling. Made fresh to order. Collection from Wicklow.",
    images: [
      {
        url: "/images/products/strawberry-pavlova-hero.jpg",
        width: 1120,
        height: 1400,
        alt: "Cakish Strawberry Pavlova — handcrafted meringue topped with fresh strawberries arranged in a floral pattern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cakish — Handcrafted Pavlova | Wicklow, Ireland",
    description:
      "Four handcrafted pavlova varieties. Dulce de Leche or Nutella filling. Made fresh to order in Wicklow, Ireland.",
    images: ["/images/products/strawberry-pavlova-hero.jpg"],
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

/* ── Schema.org Structured Data ── */
const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": "https://cakish.ie/#bakery",
  name: "Cakish",
  url: "https://cakish.ie",
  image: "https://cakish.ie/images/products/strawberry-pavlova-hero.jpg",
  description:
    "Handcrafted pavlova desserts made fresh to order in Wicklow, Ireland. Four varieties: Strawberry, Heart, Mixed Berries, and Raspberry. Dulce de Leche or Nutella filling. Collection from Wicklow.",
  email: "hello@cakish.ie",
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
  servesCuisine: "Dessert",
  sameAs: ["https://www.instagram.com/cakish.ie/"],
  hasMenu: {
    "@type": "Menu",
    name: "Cakish Pavlova Menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Pavlovas",
        hasMenuItem: [
          {
            "@type": "MenuItem",
            name: "Strawberry Pavlova",
            description:
              "Crisp meringue base, Dulce de Leche or Nutella filling, hand-piped cream, fresh Irish strawberries. Available in Small (6 inches, serves 5–6), Medium (9 inches, serves 8–12), and Large (12 inches, serves 13–18).",
            image: "https://cakish.ie/images/products/strawberry-pavlova-product.jpg",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "48",
              highPrice: "138",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              offerCount: 3,
            },
          },
          {
            "@type": "MenuItem",
            name: "Heart Pavlova",
            description:
              "Heart-shaped pavlova. Crisp meringue base, Dulce de Leche or Nutella filling, hand-piped cream, fresh strawberries. 9 inches, serves 8–10.",
            image: "https://cakish.ie/images/products/generated-heart-pavlova.jpg",
          },
          {
            "@type": "MenuItem",
            name: "Mixed Berries Pavlova",
            description:
              "Crisp meringue base, Dulce de Leche or Nutella filling, hand-piped cream, mixed fresh berries (strawberries, blueberries, raspberries, blackberries). Available in Small (6 inches, serves 5–7), Medium (9 inches, serves 8–12), and Large (12 inches, serves 13–18).",
            image: "https://cakish.ie/images/products/generated-mixed-berries-medium.jpg",
          },
          {
            "@type": "MenuItem",
            name: "Raspberry Pavlova",
            description:
              "Crisp meringue base, Dulce de Leche or Nutella filling, hand-piped cream, fresh whole raspberries. Available in Small (6 inches, serves 5–7), Medium (9 inches, serves 8–12), and Large (12 inches, serves 13–18).",
            image: "https://cakish.ie/images/products/generated-raspberry-medium.jpg",
          },
        ],
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I order pavlova in Wicklow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cakish is a premium home bakery based in Wicklow, Ireland. We handcraft pavlova desserts to order and offer collection from our Wicklow location. The exact address is shared after your order is confirmed.",
      },
    },
    {
      "@type": "Question",
      name: "What flavours of pavlova do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer four pavlova varieties: Strawberry Pavlova, Heart Pavlova, Mixed Berries Pavlova, and Raspberry Pavlova. Each comes with your choice of Dulce de Leche or Nutella filling, hand-piped cream, and fresh seasonal fruit.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order a pavlova for a communion in Ireland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Our pavlovas are a popular choice for First Holy Communion celebrations across Wicklow and Dublin. They make an elegant centrepiece that serves up to 18 guests depending on the size you choose.",
      },
    },
    {
      "@type": "Question",
      name: "What sizes are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most of our pavlovas come in three sizes: Small (6 inches, serves 5–7), Medium (9 inches, serves 8–12), and Large (12 inches, serves 13–18). The Heart Pavlova is available in one size — 9 inches, serving 8–10.",
      },
    },
    {
      "@type": "Question",
      name: "Do you deliver?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently offer collection only from our home location in Wicklow. Delivery is not available at this time.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance should I order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend ordering at least 3–5 days in advance to ensure availability. We take a limited number of orders each week so every pavlova receives full attention.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a custom message to my pavlova?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All of our pavlovas can include a custom topper message — perfect for birthdays, celebrations, or any special occasion.",
      },
    },
    {
      "@type": "Question",
      name: "Are your pavlovas gluten-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pavlova is naturally gluten-free as the meringue base is made from egg whites and sugar. However, please note that our kitchen is not a certified gluten-free facility, so we cannot guarantee zero cross-contamination.",
      },
    },
    {
      "@type": "Question",
      name: "What filling options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every Cakish pavlova comes with your choice of two fillings: Dulce de Leche (a rich, sweet caramel) or Nutella (chocolate hazelnut spread). Both are layered between the meringue base and the hand-piped cream.",
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
