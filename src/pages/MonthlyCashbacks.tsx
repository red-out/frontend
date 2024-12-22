import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/BreadCrumbs';
import '../assets/style.css';
import { Api } from '../api/Api'; // Предположительно, путь к API-клиенту

const MonthlyCashbacksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const draftOrderId = searchParams.get('draft_order_id');
  const [cashbackServices, setCashbackServices] = useState<any[]>([]);
  const [cashbacksCount, setCashbacksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedData = useRef(false); // Флаг для предотвращения лишних запросов

  const api = new Api(); // Инициализация API-клиента

  const getSessionIdFromCookies = (): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'session_id') {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    if (draftOrderId && !hasFetchedData.current) {
      fetchMonthlyCashbacks();
      hasFetchedData.current = true;
    }
  }, [draftOrderId]);

  const fetchMonthlyCashbacks = async () => {
    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      setError('Не удалось получить session_id из куков');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.cashbackOrders.cashbackOrdersRead(draftOrderId, {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });

      if (response.data) {
        const { services, cashbacks_count } = response.data;
        setCashbackServices(services || []);
        setCashbacksCount(cashbacks_count || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monthly-cashbacks-page">
      <header className="mb-4">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS</div>
          </Link>
          <Navbar />
        </div>
      </header>

      <div className="breadcrumb-container">
        <Breadcrumb
          items={[
            { label: 'Главная', path: '/' },
            { label: 'Список кешбэков', path: '/cashbacks' }, // Пункт "Список кешбэков"
            { label: 'Мои кешбэки', path: '/monthly_cashbacks' },
          ]}
        />
      </div>

      {loading && <div className="spinner">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      {draftOrderId ? (
        <div className="draft-order-info">
          <h3>Ваш черновик заказа кешбэков</h3>
          <p>Черновик заказа ID: {draftOrderId}</p>
          <p>Количество кешбэков: {cashbacksCount}</p>
        </div>
      ) : (
        <div>У вас нет черновика заказа кешбэков.</div>
      )}

      <div className="cashback-services">
        {Array.isArray(cashbackServices) && cashbackServices.length > 0 ? (
          <div className="cards-container">
            {cashbackServices.map((service) => (
              <div key={service.id} className="card">
                <div className="card-image-container">
                  <img
                    src={service.image_url || '/images/default.png'}
                    alt={service.category}
                    className="card-image"
                  />
                </div>
                <h3>{service.category}</h3>
                <p>{service.cashback_percentage_text}</p>
                <p>{service.full_description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>У вас нет кешбэков в черновике.</div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCashbacksPage;













