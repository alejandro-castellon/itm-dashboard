import "@/styles/globals.css";
import { inter } from "@/fonts/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ITM project",
  description: "Web app to control machines using iot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
