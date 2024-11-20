import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/cashback_services': {
        target: 'http://localhost:8000',  // Бэкенд адрес
        changeOrigin: true,  // Изменяет заголовок Origin для предотвращения ошибок CORS
        // Прокси переписывает путь только если нужно, здесь переписывание не требуется
        rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'),
      },
    },
  },
  plugins: [react()],
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 3000,
//     proxy: {
//       '/cashback_services': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/cashback_services/, '/cashback_services'), // сохраняем путь без изменений
//       },
//     },
//   },
//   plugins: [react()],
  
// });