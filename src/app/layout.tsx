import "./globals.css";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import React from "react";
import { getSiteSettings } from "@/lib/settings.server";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const title = settings?.seo?.metaTitle || settings?.general?.siteName || "Ceylon Travels | Sri Lanka Tour Packages";
  const description = settings?.seo?.metaDescription || settings?.general?.siteDescription || "Book the best Sri Lanka tour packages with Ceylon Travels.";
  const ogImage = settings?.branding?.ogImage || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80";

  return {
    title,
    description,
    keywords: settings?.seo?.keywords,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: (settings?.seo?.twitterCard as any) || "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: settings?.seo?.canonicalUrl,
    },
    icons: {
      icon: settings?.branding?.favicon || "/favicon.ico",
    }
  };
}

import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/CookieConsent";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const primary = settings?.branding?.primaryColor || "#013072";
  const secondary = settings?.branding?.secondaryColor || "#FF6B35";

  return (
    <html lang="en" suppressHydrationWarning className={`overflow-x-hidden ${plusJakartaSans.variable} ${lora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root, body {
            --color-brand: ${primary} !important;
            --color-accent: ${secondary} !important;
          }
        `}} />
        {settings?.advanced?.enableAnalytics && settings?.integrations?.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.integrations.googleAnalyticsId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.integrations.googleAnalyticsId}');
            `}} />
          </>
        )}
        {settings?.advanced?.enableAnalytics && settings?.integrations?.googleTagManager && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.integrations.googleTagManager}');
          `}} />
        )}
      </head>
      <body className="antialiased overflow-x-hidden">
        <Providers settings={settings}>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
