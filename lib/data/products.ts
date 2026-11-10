export type Product = {
  name: string;
  group: string;
  description: string;
  stack: string[];
  href: string;
  size?: "feature" | "wide";
};

export const products: Product[] = [
  {
    name: "Prime CLI",
    group: "SpherePrime",
    description: "Агентный AI-ассистент для кода в терминале. Любые модели, MCP, LSP.",
    stack: ["Go", "MCP", "LSP"],
    href: "https://github.com/SpherePrime/CLI",
    size: "feature",
  },
  {
    name: "Prime Desktop",
    group: "SpherePrime",
    description: "Десктоп-воркспейс для Windows и Linux: проекты, чаты, диффы, терминалы, SSH и голос.",
    stack: ["Rust", "Tauri", "React"],
    href: "https://github.com/SpherePrime/CLI/tree/main/desktop",
    size: "wide",
  },
  {
    name: "PrimeAI",
    group: "SpherePrime",
    description: "AI-провайдер для Astra с автоматической маршрутизацией через Router API.",
    stack: ["TypeScript", "Router API"],
    href: "https://github.com/SpherePrime/PrimeAi",
  },
  {
    name: "PrimeProxy",
    group: "SpherePrime",
    description: "Локальный MTProto-прокси для Telegram с WebSocket-транспортом.",
    stack: ["Rust", "MTProto", "WebSocket"],
    href: "https://github.com/SpherePrime/PrimeProxy",
  },
  {
    name: "TG for Astra",
    group: "Голос",
    description: "Telegram голосом: озвучка сообщений, голосовые и ответы под диктовку.",
    stack: ["TypeScript", "Telegram"],
    href: "https://github.com/dwertyfa288/dwertyfa-astra-tg",
  },
  {
    name: "Astra Interject",
    group: "Голос",
    description: "Продолжение диалога после ответа Astra без повторного триггерного слова.",
    stack: ["TypeScript", "Voice"],
    href: "https://github.com/dwertyfa288/astra-interject",
  },
  {
    name: "Мой Дизайнер",
    group: "Telegram",
    description: "Бот и Mini App для AI-дизайна интерьеров, анализа ремонта и подбора товаров.",
    stack: ["Python", "aiogram", "FastAPI", "React"],
    href: "https://github.com/dwertyfa288",
    size: "wide",
  },
  {
    name: "ssh-mcp",
    group: "MCP",
    description: "MCP-сервер, через который AI-агент работает с удалёнными машинами по SSH.",
    stack: ["TypeScript", "MCP", "SSH"],
    href: "https://github.com/dwertyfa288/ssh-mcp",
  },
];
