import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { api_proxy_addr, img_proxy_addr } from './src/target_config';  // Импортируем необходимые переменные
// https://vitejs.dev/config/
export default defineConfig({ // Замените RepoName на имя вашего репозитория
  server: {
    port: 3000,
    proxy: {
      '/cashback_services': {
        target: api_proxy_addr, // Адрес вашего бэкенда
        changeOrigin: true, // Изменяет заголовок Origin для предотвращения ошибок CORS
        rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'), // Переписывание пути (если необходимо)
      },
      '/img-proxy': {
        target: img_proxy_addr, // Прокси-адрес для изображений
        changeOrigin: true, // Изменение заголовков при проксировании
        rewrite: (path) => path.replace(/^\/img-proxy/, '/'), // Оставляем префикс /img-proxy в пути
      },
    },
  },
  plugins: [react()], // Подключаем плагин mkcert для генерации сертификатов
});
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import mkcert from 'vite-plugin-mkcert';
// import fs from 'fs';
// import path from 'path';
// import { api_proxy_addr, img_proxy_addr, dest_root } from './src/target_config';  // Импортируем необходимые переменные
// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/frontend/', // Замените RepoName на имя вашего репозитория
//   server: {
//     host: '0.0.0.0', // Это позволяет серверу слушать все сетевые интерфейсы
//     port: 3000,
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'cert.key')), // Путь к вашему приватному ключу
//       cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')), // Путь к вашему сертификату
//     },
//     proxy: {
//       '/cashback_services': {
//         target: 'http://localhost:8000', // Адрес вашего бэкенда
//         changeOrigin: true, // Изменяет заголовок Origin для предотвращения ошибок CORS
//         rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'), // Переписывание пути (если необходимо)
//       },
//     },
//   },
//   plugins: [react(), mkcert()], // Подключаем плагин mkcert для генерации сертификатов
// });



