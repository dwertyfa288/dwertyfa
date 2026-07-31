# dwertyfa — portfolio

Интерактивное портфолио full-stack разработчика на Next.js, React и TypeScript.

## Локальный запуск

```bash
npm install
npm run dev
```

## GitHub Pages

Проект уже содержит workflow `.github/workflows/deploy-pages.yml`.

1. Создайте публичный репозиторий на GitHub.
2. Загрузите проект в ветку `main`.
3. В настройках репозитория откройте **Settings → Pages**.
4. В разделе **Build and deployment** выберите **GitHub Actions**.

После каждого push в `main` сайт будет собираться и публиковаться
автоматически. Путь к репозиторию подставляется при сборке, поэтому ассеты
корректно работают на адресе вида `username.github.io/repository`.

Для ручной проверки статической версии:

```bash
BASE_PATH=/portfolio npm run build:github
```

Готовые статические файлы появятся в папке `out`.
