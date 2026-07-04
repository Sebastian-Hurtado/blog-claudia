import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claudia Castellanos",
  description:
    "Blog profesional de Claudia — Abogada y Profesora especializada en Derecho.",
  icons: {
    icon: "/logo-blog.png",
    shortcut: "/logo-blog.png",
    apple: "/logo-blog.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full`}
      >
        <AuthProvider>
          <Header />
          <main className="w-full">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
