import React from "react";
import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import AccessibilityFab from "@/features/accessibility/AccessibilityFab";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nepal Nutrition Dashboard",
  description: "Comprehensive nutrition data and visualization for Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased min-h-screen bg-background pt-28 flex flex-col`}
      >
        <Providers>
          {children}
          <AccessibilityFab />
        </Providers>
      </body>
    </html>
  );
}
