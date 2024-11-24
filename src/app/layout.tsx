import { ColorProvider } from "@/providers/ColorProvider";
import HeaderNav from "@/components/Header/Header"

import type { Metadata } from "next";
import '@fontsource-variable/onest';
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Colors Extractor",
  description: "Innovative tool designed to extract harmonious color palettes from any image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ColorProvider>
        <body className="overflow-hidden w-screen h-screen bg-primary">
          <div className="w-full h-full flex">
            <HeaderNav />
            {children}
          </div>
        </body>
      </ColorProvider>
    </html>
  );
}
