import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cakish.ie",
  description:
    "A premium home bakery offering a modern take on pavlova for meaningful celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
