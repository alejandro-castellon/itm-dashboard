import "@/styles/globals.css";
import { inter } from "@/fonts/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
