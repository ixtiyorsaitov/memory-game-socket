import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import InitAuth from "@/components/initial/init-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memory Card Game",
  description:
    "A fun memory card game with single player and online multiplayer modes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen bg-background">{children}</div>
        </ThemeProvider>
        <InitAuth />
      </body>
    </html>
  );
}
