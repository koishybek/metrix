# Metrix - Проверка статуса умных водосчётчиков

Одностраничное приложение (SPA) для проверки статуса и показаний умных водосчётчиков SmartMetrix.

## Технологии

- React + Vite
- TypeScript
- Tailwind CSS
- Axios

## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

3. Откройте приложение в браузере (обычно http://localhost:5173).

## Настройка окружения

Файл `.env` уже настроен с тестовыми данными:
```
VITE_API_BASE_URL=https://sm.iot-exp.kz/api/v1/meter/
VITE_API_TOKEN=your_token_here
```

## CORS и Прокси

Приложение настроено на прямую работу с API. Если возникают проблемы с CORS при локальной разработке:

1. В `vite.config.ts` уже можно добавить настройки прокси (раскомментировать или добавить при необходимости).
2. Или используйте простой Node.js прокси (см. `proxy-server.js`).

## Деплой

### Vercel / Netlify

1. Импортируйте проект из GitHub/GitLab.
2. Установите переменные окружения (Environment Variables):
   - `VITE_API_BASE_URL`
   - `VITE_API_TOKEN`
3. Build command: `npm run build`
4. Output directory: `dist`

## Структура проекта

- `src/components` - UI компоненты
- `src/services` - API запросы
- `src/types` - TypeScript интерфейсы
- `src/lib` - Утилиты
