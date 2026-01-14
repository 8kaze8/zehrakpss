/**
 * Root Layout
 * Next.js App Router root layout
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { StudyProgressProvider } from "@/context/StudyProgressContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KPSS Takip - Zehra",
  description: "KPSS çalışma takip uygulaması",
  other: {
    "material-symbols": "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2b8cee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="light">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <StudyProgressProvider>
              <ErrorBoundary>
                <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-24">
                  {children}
                  <BottomNavigation />
                </div>
              </ErrorBoundary>
            </StudyProgressProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
