# dwertyfa — portfolio

Портфолио full-stack разработчика в стилистике профиля: тёмный «чертёж», оранжевый сигнал, рамки и подписи `fig.`

https://dwertyfa288.github.io/dwertyfa/

## Стек

Next.js (static export) · React · TypeScript · Three.js · CSS Modules

## 3D

| Сцена | Где | Смысл |
| --- | --- | --- |
| `globeScene` | шапка | сеть: узлы-серверы и сигналы по дугам |
| `waveScene` | веб-проекты | поле точек, реагирует на курсор |
| `stackScene` | стек | 4 слоя продукта: веб, бэкенд, голос, AI |
| `planeScene` | связь | самолётик Telegram |

Все сцены работают через общий `lib/three/runner.ts`: рендер только когда сцена на экране и вкладка активна, ограничение pixel ratio, упрощённая геометрия на телефонах, статичный кадр при `prefers-reduced-motion`.

## Структура

- `app/` — layout, страница, глобальные токены
- `components/` — секции и UI
- `lib/data/` — проекты, продукты, навыки, ссылки
- `lib/three/` — 3D-сцены и раннер

## Команды

```bash
npm install
npm run dev
npm test
```

Деплой на GitHub Pages — автоматически при пуше в `main`.
