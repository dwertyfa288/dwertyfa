import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const title = "dwertyfa — full-stack разработчик";
const description =
  "Сайты, голосовые интерфейсы, плагины для Astra, Telegram-боты и AI-инструменты. От идеи до продукта.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: `${process.env.BASE_PATH ?? ""}/favicon.svg` },
  authors: [{ name: "dwertyfa" }],
  keywords: ["full-stack разработчик", "веб-разработка", "Next.js", "Three.js", "Telegram-боты", "AI-инструменты"],
  openGraph: { title, description, type: "website", locale: "ru_RU" },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
