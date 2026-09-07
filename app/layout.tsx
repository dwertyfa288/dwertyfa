import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Manrope({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "dwertyfa — Full-stack разработчик",
  description:
    "Код. Форма. Впечатление. Разрабатываю сайты и цифровые продукты — от архитектуры до выразительного интерфейса. Nova Prestige, Roxy Boost и другие проекты.",
  icons: { icon: `${process.env.BASE_PATH ?? ""}/favicon.svg` },
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
      <body
        className={`${display.variable} ${editorial.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
