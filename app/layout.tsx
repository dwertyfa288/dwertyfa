import type { Metadata } from "next";
import { Golos_Text, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Golos_Text({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "dwertyfa — Full-stack разработчик",
  description:
    "Разработка в другом измерении. Портфолио dwertyfa: сайты, цифровые продукты, интерактивные интерфейсы. Nova Prestige, Roxy Boost, danek montage и Hey Ksusha.",
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
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
