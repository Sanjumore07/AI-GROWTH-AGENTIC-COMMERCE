import type { Metadata } from "next";
import "./globals.css";
import { GlobalCommandPalette } from "@/components/global-command-palette";

export const metadata: Metadata = {
  title: "CommercePilot AI — From Customer Intent to Completed Purchase Autonomously",
  description:
    "Autonomous agentic commerce operating system. Understands customer intent, discovers products, personalizes offers, recovers abandoned carts, and drives measurable growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <GlobalCommandPalette />
        {children}
      </body>
    </html>
  );
}
