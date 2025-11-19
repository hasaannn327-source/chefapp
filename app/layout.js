import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chef App - Yemek Tarifi Uygulaması",
  description: "AI destekli yemek tarifi ve mutfak asistanı",
  manifest: "/manifest.json",
  themeColor: "#FF6B6B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chef App",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B6B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chef App" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Script src="/pwa-install.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
