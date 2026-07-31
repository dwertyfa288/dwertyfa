import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dwertyfa — Full-stack разработчик",
  description:
    "Разработка цифровых продуктов целиком: инфраструктура, backend и выразительные пользовательские интерфейсы.",
  keywords: [
    "full-stack разработчик",
    "веб-разработка",
    "React",
    "Next.js",
    "инфраструктура",
    "портфолио разработчика",
  ],
  authors: [{ name: "dwertyfa" }],
  openGraph: {
    title: "dwertyfa — Full-stack разработчик",
    description:
      "От инфраструктуры до интерфейса. Избранные проекты и технологическая экспертиза.",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary",
    title: "dwertyfa — Full-stack разработчик",
    description:
      "От инфраструктуры до интерфейса. Избранные проекты и технологическая экспертиза.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
