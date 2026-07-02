import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { AuthModal } from "@/components/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Macgence Data Marketplace — Premium Datasets",
  description: "Browse, preview, and purchase high-quality datasets for AI, ML, and analytics. Curated data across industries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0a0e1a] text-white font-[family-name:var(--font-geist-sans)]">
        <Providers>
          {children}
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
