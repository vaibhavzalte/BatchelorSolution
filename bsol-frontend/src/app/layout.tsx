import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CategoryProvider } from "@/contexts/CategoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BatchelorSolution - Easy Living for Every Bachelor",
  description: "Find rooms, vacancies, and food stalls near you with BatchelorSolution. The ultimate platform for bachelor lifestyle management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <CategoryProvider>
          <Header />
          <main className="flex-1 w-full pt-24">{children}</main>
          <Footer />
        </CategoryProvider>
      </body>
    </html>
  );
}
