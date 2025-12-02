import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexNeighbour - Connect with Your Community",
  description: "Discover your community, find local services, and build meaningful connections with people around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
