export type WebProject = {
  id: string;
  name: string;
  category: string;
  type: string;
  href: string;
  domain: string;
  description: string;
  tags: string[];
  image?: string;
};

export const webProjects: WebProject[] = [
  {
    id: "nova",
    name: "Nova Prestige",
    category: "Недвижимость",
    type: "Промо-сайт",
    href: "https://novaprestige.ru/",
    domain: "novaprestige.ru",
    description: "Сайт приватного жилого дома в центре Бишкека: атмосфера, детали, плавное движение.",
    tags: ["Next.js", "Анимации", "Адаптив"],
    image: "nova.webp",
  },
  {
    id: "primeboost",
    name: "Prime Boost",
    category: "Цифровой продукт",
    type: "VPN-сервис",
    href: "https://roxyvpn.ru/",
    domain: "roxyvpn.ru",
    description: "VPN-продукт целиком: инфраструктура, серверная логика, приложение и сайт.",
    tags: ["Full-stack", "Инфраструктура", "Web app"],
    image: "roxy.webp",
  },
  {
    id: "hostel",
    name: "Хостел Пушкин",
    category: "Гостиницы",
    type: "Редизайн",
    href: "https://hostel-ekaterinburg.ru/",
    domain: "hostel-ekaterinburg.ru",
    description: "Фирменный стиль, новости с админкой, галереи номеров и бронирование TravelLine.",
    tags: ["Админка", "TravelLine", "Брендинг"],
  },
  {
    id: "lotos",
    name: "ЛОТОС",
    category: "Бьюти",
    type: "Сайт салона",
    href: "https://lotos-polevskoy.ru/",
    domain: "lotos-polevskoy.ru",
    description: "Барбершоп и лазерная эпиляция на одном домене — два направления, одна система.",
    tags: ["Лендинг", "Запись", "Адаптив"],
  },
  {
    id: "danek",
    name: "danek montage",
    category: "Креатив",
    type: "Портфолио",
    href: "https://fazedanek-hub.github.io/danekmontage/",
    domain: "danekmontage",
    description: "Портфолио видеомонтажёра, где движение — часть истории.",
    tags: ["React", "Motion UI", "Видео"],
  },
  {
    id: "ksusha",
    name: "Hey Ksusha",
    category: "Образование",
    type: "Лендинг интенсива",
    href: "https://heyksusha.ru/intensive",
    domain: "heyksusha.ru",
    description: "Тёплая подача, понятный следующий шаг, запись и платёжная интеграция.",
    tags: ["Арт-дирекшн", "Платежи", "Лендинг"],
    image: "ksusha.webp",
  },
];
