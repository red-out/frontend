import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import CashbackPage from './pages/CashbackPage';
import CashbackDetailsPage from './pages/CashbackDetailsPage';
import HomeCashback from './pages/HomeCashback';

interface BreadcrumbProps {
  items: { label: string; path: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
      <nav className="breadcrumb">
          {items.map((item, index) => (
              <span key={index}>
                  <Link to={item.path} className="breadcrumb-link">
                      {item.label}
                  </Link>
                  {index < items.length - 1 && <span> &gt; </span>} {/* Separator */}
              </span>
          ))}
      </nav>
  );
};

export default Breadcrumb;
// Создаем маршрутизатор
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeCashback />,
  },
  {
    path: '/cashbacks',
    element: <CashbackPage />,
  },
  {
    path: '/cashback-details/:id',  // Динамический маршрут для деталей оборудования
    element: <CashbackDetailsPage />,
  },
]);

// Рендерим приложение
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);