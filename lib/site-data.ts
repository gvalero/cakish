/* ─────────────────────────────────────────────────────────
 *  Cakish — site-wide data & product configuration
 *  All prices are placeholder values (TBD by owner).
 *  Update the `price` fields below once pricing is finalised.
 * ───────────────────────────────────────────────────────── */

// ── Filling options (shared across all products) ──
export const fillingOptions = [
  { id: "dulce-de-leche", label: "Dulce de Leche" },
  { id: "nutella", label: "Nutella" },
] as const;

export type FillingId = (typeof fillingOptions)[number]["id"];

// ── Size definition ──
export interface SizeOption {
  id: string;
  label: string;
  diameter: string;
  serves: string;
  /** Placeholder price in EUR — set to 0 until confirmed */
  price: number;
}

// ── Product definition ──
export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  /** Additional gallery images */
  gallery: string[];
  sizes: SizeOption[];
  /** Whether the product supports a custom topper message */
  hasTopper: boolean;
  /** Whether the Strawberry sharing-size finishing options apply */
  hasFinishOptions: boolean;
}

// ── Products ──
export const products: Product[] = [
  {
    id: "strawberry-pavlova",
    name: "Strawberry Pavlova",
    slug: "strawberry-pavlova",
    tagline: "Our signature creation",
    description:
      "A stunning centrepiece built on a crisp meringue base, layered with your choice of Dulce de Leche or Nutella, hand-piped cream, and crowned with a sculpted arrangement of fresh Irish strawberries. Available in three sizes to suit any occasion — from an intimate birthday to a grand celebration.",
    image: "/images/products/strawberry-pavlova-product.jpg",
    gallery: [
      "/images/products/strawberry-pavlova-hero.jpg",
      "/images/products/strawberry-pavlova-detail.jpg",
      "/images/products/strawberry-pavlova-gallery-1.jpg",
      "/images/products/strawberry-pavlova-gallery-2.jpg",
    ],
    sizes: [
      { id: "small", label: "Small", diameter: '6 inches', serves: "5–6", price: 0 },
      { id: "medium", label: "Medium", diameter: '9 inches', serves: "8–12", price: 0 },
      { id: "large", label: "Large", diameter: '12 inches', serves: "13–18", price: 0 },
    ],
    hasTopper: true,
    hasFinishOptions: true,
  },
  {
    id: "heart-pavlova",
    name: "Heart Pavlova",
    slug: "heart-pavlova",
    tagline: "Romance on a plate",
    description:
      "A heart-shaped pavlova that makes the perfect romantic gesture. Built on a crisp meringue base with your choice of filling, hand-piped cream, and beautifully arranged fresh strawberries. At 9 inches, it serves 8–10 guests — ideal for anniversaries, Valentine's Day, or any heartfelt celebration.",
    image: "/images/products/generated-heart-pavlova.jpg",
    gallery: [],
    sizes: [
      { id: "standard", label: "Standard", diameter: '9 inches', serves: "8–10", price: 0 },
    ],
    hasTopper: true,
    hasFinishOptions: false,
  },
  {
    id: "mixed-berries-pavlova",
    name: "Mixed Berries Pavlova",
    slug: "mixed-berries-pavlova",
    tagline: "A berry medley",
    description:
      "A vibrant celebration of seasonal berries atop our signature meringue base. Layered with your choice of Dulce de Leche or Nutella, hand-piped cream, and finished with a generous arrangement of strawberries, blueberries, raspberries, and blackberries. A colourful showstopper for any gathering.",
    image: "/images/products/generated-mixed-berries-medium.jpg",
    gallery: [],
    sizes: [
      { id: "small", label: "Small", diameter: '6 inches', serves: "5–7", price: 0 },
      { id: "medium", label: "Medium", diameter: '9 inches', serves: "8–12", price: 0 },
      { id: "large", label: "Large", diameter: '12 inches', serves: "13–18", price: 0 },
    ],
    hasTopper: true,
    hasFinishOptions: false,
  },
  {
    id: "raspberry-pavlova",
    name: "Raspberry Pavlova",
    slug: "raspberry-pavlova",
    tagline: "Bold & beautiful",
    description:
      "Whole fresh raspberries arranged in a striking dome pattern atop our crisp meringue base, with your choice of Dulce de Leche or Nutella and hand-piped cream. The tartness of the raspberries balances beautifully with the sweet meringue and rich filling — a sophisticated choice for any occasion.",
    image: "/images/products/generated-raspberry-medium.jpg",
    gallery: [],
    sizes: [
      { id: "small", label: "Small", diameter: '6 inches', serves: "5–7", price: 0 },
      { id: "medium", label: "Medium", diameter: '9 inches', serves: "8–12", price: 0 },
      { id: "large", label: "Large", diameter: '12 inches', serves: "13–18", price: 0 },
    ],
    hasTopper: true,
    hasFinishOptions: false,
  },
];

// ── Helper: look up a product by slug ──
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// ── Finish options (for Strawberry sharing-size pavlovas) ──
export const finishOptions = [
  {
    id: "floral",
    label: "Floral Finish",
    description:
      "Whole strawberries thinly sliced and arranged in a sculpted floral pattern. A signature presentation that turns the pavlova into a centrepiece.",
  },
  {
    id: "patisserie-sliced",
    label: "Patisserie Sliced Finish",
    description:
      "Precisely sliced strawberries layered in a clean, contemporary arrangement. A polished patisserie look that is effortless to serve.",
  },
] as const;

export type FinishId = (typeof finishOptions)[number]["id"];

// ── Site-wide content ──
export const siteContent = {
  brandName: "Cakish",
  productName: "Cakish Handcrafted Pavlova",
  tagline: "Handcrafted in Wicklow",
  heroHeadline: "Handcrafted Pavlova\nfor Every Occasion",
  heroSubtitle:
    "Built on a crisp meringue base, layered with Dulce de Leche or Nutella, finished with hand-piped cream and fresh seasonal fruit. Made to order in Wicklow, Ireland.",
  collectionModel:
    "Collection is currently the only fulfilment option. Collection is arranged from our home location in Wicklow, with the exact address shared after confirmation. Delivery is not offered at this time.",
  footerCopy:
    "A premium home bakery in Wicklow, Ireland — handcrafting pavlova for birthdays, communions, elegant hosting, and meaningful gatherings. Collection details are confirmed personally after enquiry or order reservation.",
  email: "hello@cakish.ie",
  instagram: "https://www.instagram.com/cakish.ie/",
  collectionHighlights: [
    {
      title: "Collection from Wicklow",
      copy: "Collection is arranged from our home location in Wicklow, with the exact address shared after confirmation.",
    },
    {
      title: "Made Fresh to Order",
      copy: "Every pavlova is made fresh for your chosen collection date. We take a limited number of orders each week.",
    },
    {
      title: "Delivery",
      copy: "Delivery is not currently offered. All orders are arranged for collection from Wicklow.",
    },
  ],
  occasions: [
    {
      title: "Birthdays",
      description: "A stunning centrepiece for birthday celebrations of all sizes.",
      image: "/images/products/strawberry-pavlova-gallery-3.jpg",
    },
    {
      title: "Communions",
      description: "An elegant dessert for First Holy Communion celebrations in Ireland.",
      image: "/images/products/strawberry-pavlova-gallery-4.jpg",
    },
    {
      title: "Gatherings",
      description: "Perfect for dinner parties, family get-togethers, and elegant hosting.",
      image: "/images/products/strawberry-pavlova-gallery-5.jpg",
    },
  ],
  storyPillars: [
    {
      title: "Modern",
      heading: "Not quite traditional, intentionally so.",
      copy: "The Cakish approach keeps the airy elegance people associate with pavlova while reworking the shape, styling, and occasion into something more contemporary.",
    },
    {
      title: "Refined",
      heading: "Designed to sit beautifully on the table.",
      copy: "Soft neutrals, floral detailing, and restrained presentation help each piece feel graceful, elevated, and quietly celebratory.",
    },
    {
      title: "Meaningful",
      heading: "Made for occasions people remember.",
      copy: "From intimate birthdays to family celebrations, each order is positioned as part dessert, part centrepiece, and part gesture.",
    },
  ],
  faq: [
    {
      question: "Where can I order pavlova in Wicklow?",
      answer:
        "Cakish is a premium home bakery based in Wicklow, Ireland. We handcraft pavlova desserts to order and offer collection from our Wicklow location. The exact address is shared after your order is confirmed.",
    },
    {
      question: "What flavours of pavlova do you offer?",
      answer:
        "We offer four pavlova varieties: Strawberry Pavlova, Heart Pavlova, Mixed Berries Pavlova, and Raspberry Pavlova. Each comes with your choice of Dulce de Leche or Nutella filling, hand-piped cream, and fresh seasonal fruit.",
    },
    {
      question: "Can I order a pavlova for a communion in Ireland?",
      answer:
        "Absolutely. Our pavlovas are a popular choice for First Holy Communion celebrations across Wicklow and Dublin. They make an elegant centrepiece that serves up to 18 guests depending on the size you choose.",
    },
    {
      question: "What sizes are available?",
      answer:
        "Most of our pavlovas come in three sizes: Small (6 inches, serves 5–7), Medium (9 inches, serves 8–12), and Large (12 inches, serves 13–18). The Heart Pavlova is available in one size — 9 inches, serving 8–10.",
    },
    {
      question: "Do you deliver?",
      answer:
        "We currently offer collection only from our home location in Wicklow. Delivery is not available at this time, but we may offer Dublin collection in the future.",
    },
    {
      question: "How far in advance should I order?",
      answer:
        "We recommend ordering at least 3–5 days in advance to ensure availability. We take a limited number of orders each week so every pavlova receives full attention.",
    },
    {
      question: "Can I add a custom message to my pavlova?",
      answer:
        "Yes! All of our pavlovas can include a custom topper message — perfect for birthdays, celebrations, or any special occasion.",
    },
    {
      question: "Are your pavlovas gluten-free?",
      answer:
        "Pavlova is naturally gluten-free as the meringue base is made from egg whites and sugar. However, please note that our kitchen is not a certified gluten-free facility, so we cannot guarantee zero cross-contamination.",
    },
    {
      question: "What is the best pavlova for a birthday in Ireland?",
      answer:
        "Our Strawberry Pavlova is our most popular choice for birthdays. The Large size (12 inches) is perfect for bigger parties, while the Small (6 inches) is ideal for intimate celebrations. Add a custom topper message to make it extra special.",
    },
    {
      question: "What filling options are available?",
      answer:
        "Every Cakish pavlova comes with your choice of two fillings: Dulce de Leche (a rich, sweet caramel) or Nutella (chocolate hazelnut spread). Both are layered between the meringue base and the hand-piped cream.",
    },
  ],
} as const;

// ── Legacy export for backward compatibility ──
export const productConfig = {
  sizes: {
    '6"': { basePrice: 0, description: "Perfect for intimate tables and smaller celebrations." },
    '9"': { basePrice: 0, description: "A balanced centrepiece for most family occasions." },
    '12"': { basePrice: 0, description: "Created for larger tables and bigger moments." },
  },
  finishes: {
    "floral-finish": {
      label: "Floral Finish",
      surcharge: 0,
      description: "A signature floral presentation with sculpted strawberry slices.",
    },
    "patisserie-sliced-finish": {
      label: "Patisserie Sliced Finish",
      surcharge: 0,
      description: "Precisely sliced strawberries in a clean, contemporary patisserie arrangement.",
    },
  },
} as const;
