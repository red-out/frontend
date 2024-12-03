import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/frontend/', // Замените RepoName на имя вашего репозитория
  server: {
    host: '0.0.0.0', // Это позволяет серверу слушать все сетевые интерфейсы
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')), // Путь к вашему приватному ключу
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')), // Путь к вашему сертификату
    },
    proxy: {
      '/cashback_services': {
        target: 'http://localhost:8000', // Адрес вашего бэкенда
        changeOrigin: true, // Изменяет заголовок Origin для предотвращения ошибок CORS
        rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'), // Переписывание пути (если необходимо)
      },
    },
  },
  plugins: [react(), mkcert()], // Подключаем плагин mkcert для генерации сертификатов
});



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 3000,
//     proxy: {
//       '/cashback_services': {
//         target: 'http://localhost:8000',  // Бэкенд адрес
//         changeOrigin: true,  // Изменяет заголовок Origin для предотвращения ошибок CORS
//         // Прокси переписывает путь только если нужно, здесь переписывание не требуется
//         rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'),
//       },
//     },
//   },
//   plugins: [react()],
// });

