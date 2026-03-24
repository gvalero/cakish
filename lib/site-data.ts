export const siteContent = {
  productName: "The Cakish Modern Pavlova",
  collectionModel:
    "Collection is currently the only fulfilment option. Primary collection is arranged from our home location, while Dublin collection is available on selected days. Delivery is not offered at this time.",
  footerCopy:
    "A premium home bakery for birthdays, communions, elegant hosting, and meaningful gatherings. Collection details are confirmed personally after enquiry or order reservation.",
  collectionHighlights: [
    {
      title: "Primary collection",
      copy: "Collection is arranged from our home location, with the exact address shared after confirmation.",
    },
    {
      title: "Dublin collection",
      copy: "Dublin collection is available on selected days only and should be confirmed in advance.",
    },
    {
      title: "Delivery",
      copy: "Delivery is not currently offered, so all orders are arranged for collection.",
    },
  ],
  storyPillars: [
    {
      title: "Modern",
      heading: "Not quite traditional, intentionally so.",
      copy:
        "The Cakish approach keeps the airy elegance people associate with pavlova while reworking the shape, styling, and occasion into something more contemporary.",
    },
    {
      title: "Refined",
      heading: "Designed to sit beautifully on the table.",
      copy:
        "Soft neutrals, floral detailing, and restrained presentation help each piece feel graceful, elevated, and quietly celebratory.",
    },
    {
      title: "Meaningful",
      heading: "Made for occasions people remember.",
      copy:
        "From intimate birthdays to family celebrations, each order is positioned as part dessert, part centrepiece, and part gesture.",
    },
  ],
} as const;

export const productConfig = {
  sizes: {
    '6"': {
      basePrice: 48,
      description: "Perfect for intimate tables, thoughtful gifting, or smaller celebrations.",
    },
    '8"': {
      basePrice: 68,
      description: "A balanced centrepiece for most family occasions and elegant hosting.",
    },
    '12"': {
      basePrice: 112,
      description: "Created for larger tables, bigger moments, and generous serving.",
    },
  },
  finishes: {
    "strawberry-floral-finish": {
      label: "Strawberry Floral Finish",
      surcharge: 18,
      description:
        "A signature floral presentation with strawberry accents for a more expressive, premium finish.",
    },
    "patisserie-sliced-finish": {
      label: "Patisserie Sliced Finish",
      surcharge: 0,
      description:
        "An elegant sliced presentation for effortless serving and a cleaner patisserie look.",
    },
  },
} as const;
