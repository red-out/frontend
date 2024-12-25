import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import store from './store';
import CashbackPage from './pages/CashbackPage';
import CashbackDetailsPage from './pages/CashbackDetailsPage';
import HomeCashback from './pages/HomeCashback';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import MonthlyCashbacksPage from './pages/MonthlyCashbacks'
import LastCashbacks from './pages/LastCashbacks'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomeCashback />,
    },
    {
      path: '/cashbacks',
      element: <CashbackPage />,
    },
    {
      path: '/cashback-details/:id', 
      element: <CashbackDetailsPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/monthly_cashbacks',
      element: <MonthlyCashbacksPage />,
    },
    {
      path: '/past_cashbacks',
      element: <LastCashbacks />,
    },
  ],

);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// Регистрация service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(() => console.log("Service Worker зарегистрирован"))
      .catch(err => console.log("Service Worker не зарегистрирован", err));
  });
}


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import './index.css';
// import CashbackPage from './pages/CashbackPage';
// import CashbackDetailsPage from './pages/CashbackDetailsPage';
// import HomeCashback from './pages/HomeCashback';

// interface BreadcrumbProps {
//   items: { label: string; path: string }[];
// }

// const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
//   return (
//     <nav className="breadcrumb">
//       {items.map((item, index) => (
//         <span key={index}>
//           <Link to={item.path} className="breadcrumb-link">
//             {item.label}
//           </Link>
//           {index < items.length - 1 && <span> &gt; </span>} {/* Separator */}
//         </span>
//       ))}
//     </nav>
//   );
// };

// export default Breadcrumb;

// // Создаем маршрутизатор с basename
// const router = createBrowserRouter(
//   [
//     {
//       path: '/',
//       element: <HomeCashback />,
//     },
//     {
//       path: '/cashbacks',
//       element: <CashbackPage />,
//     },
//     {
//       path: '/cashback-details/:id', // Динамический маршрут для деталей оборудования
//       element: <CashbackDetailsPage />,
//     },
//   ],
//   {
//     basename: '/frontend', // Укажите здесь имя вашего репозитория
//   }
// );

// // Рендерим приложение
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

// // Регистрируем сервис-воркер
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function() {
//     navigator.serviceWorker
//       .register("/serviceWorker.js")
//       .then(() => console.log("Service Worker зарегистрирован"))
//       .catch(err => console.log("Service Worker не зарегистрирован", err));
//   });
// }




//https://red-out.github.io/frontend

