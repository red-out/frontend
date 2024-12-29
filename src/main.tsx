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
import MonthlyCashbacksPage from './pages/MonthlyCashbacks';
import LastCashbacks from './pages/LastCashbacks';

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
      path: '/monthly_cashbacks/:draft_order_id',  // Обновили путь
      element: <MonthlyCashbacksPage />,
    },
    {
      path: '/past_cashbacks',
      element: <LastCashbacks />,
    },
  ],
  {
    basename: '/frontend',
  }
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

