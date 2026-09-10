import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://saurya.me/'),
  title: "Saurya Janbandhu | Systems Engineer",
  description: "Systems engineer focused on enterprise cloud resilience, zero-trust identity, and endpoint management.",
  keywords: "Saurya Janbandhu, Systems Engineer, Microsoft Intune, Microsoft Entra ID, Azure, Zero Trust, Endpoint Management, Cloud Security",
  authors: [{ name: "Saurya Janbandhu" }],
  creator: "Saurya Janbandhu",
  publisher: "Saurya Janbandhu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Saurya Janbandhu - Systems Engineer",
    description: "Enterprise cloud resilience, zero-trust identity, and endpoint management.",
    siteName: "Saurya Janbandhu's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurya Janbandhu - Systems Engineer",
    description: "Enterprise cloud resilience, zero-trust identity, and endpoint management.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none" suppressHydrationWarning>
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''}/>
    </html>
  );
}
