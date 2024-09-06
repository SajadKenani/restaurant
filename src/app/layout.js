"use client";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/utils/LanguageContext";
import { getSettings } from "@/api/settings";
import { displayImageURL } from "@/utils/appUtils";
import QueryClientProviderWrapper from "@/utils/QueryClientProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, params: { locale } }) {
  const [metadata, setMetadata] = useState({
    title: "Default Site Name",
    description: "Default site description",
    icon: "uploads/default-icon.png",
    keywords: "Default, Keywords",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        console.log("Settings:", data);
        setMetadata({
          title: data.en_site_name || data.ar_site_name || "Default Site Name",
          description:
            data.en_site_description ||
            data.ar_site_description ||
            "Default site description",
          icon: data.site_favicon || "uploads/default-icon.png",
          keywords: data.site_keywords || "Default, Keywords",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []); // Runs once on mount

  console.log("metadata", metadata);

  return (
    <LanguageProvider>
      <html lang={locale}>
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          <link rel="icon" href={displayImageURL(metadata.icon)} />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <style>{inter.css}</style>
        </head>
        <body className={`${inter.className} `}>
          <div className="fixed top-0 left-0 h-screen w-screen bg-indigo-50 -z-10"></div>
          <QueryClientProviderWrapper>
            <Header />
            {children}
            <Footer />
          </QueryClientProviderWrapper>
        </body>
      </html>
    </LanguageProvider>
  );
}
