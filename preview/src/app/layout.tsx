import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaultica Keystone - Brand Preview",
  description: "Design system preview for human review of logos, colors, and typography",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
