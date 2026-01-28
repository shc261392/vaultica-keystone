import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blink Vault Design System - Brand Preview",
  description:
    "Design system preview for human review of Blink Vault logos, colors, and typography. By Vaultica.",
  icons: {
    icon: "/logos/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
