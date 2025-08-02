import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liquid Glass - A Liquid Glass Effect Demo for React",
  description: "A Liquid Glass Effect Demo for React",
  keywords: "liquid glass, liquid glass effect, liquid glass library, liquid glass react, liquid glass next, liquid glass tailwind, liquid glass css",
  // viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
