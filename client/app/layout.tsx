import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import InitAuth from "@/components/initial/init-auth";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/components/providers/socket-context";
import Footer from "@/components/shared/footer";

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
          <SocketProvider>
            <div className="min-h-screen bg-background">{children}</div>
            <Footer />
          </SocketProvider>
          <Toaster />
        </ThemeProvider>
        <InitAuth />
      </body>
    </html>
  );
}
