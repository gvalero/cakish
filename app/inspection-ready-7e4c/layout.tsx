import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Safety Inspection Pack",
  description: "Private operational food safety documentation for Cakish.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0,
    },
  },
  referrer: "no-referrer",
};

export default function InspectionPackLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
