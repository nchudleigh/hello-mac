import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mac App Downloads",
  description: "A curated list of Mac app downloads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
