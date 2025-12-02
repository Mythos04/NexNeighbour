import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "NextNeighbor - Connect with Your Neighborhood",
  description: "Discover local offerings, share resources, and build real connections in your area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
