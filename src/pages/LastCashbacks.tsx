import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/BreadCrumbs';
import { RootState } from '../store';
import { Api } from '../api/Api';
import '../assets/style.css';

interface CashbackOrder {
  id: number;
  status: string;
  creation_date: string;
  formation_date: string | null;
  completion_date: string | null;
  month: string;
  total_spent_month: number;
  creator: number;
  moderator: number;
}

const monthNames: { [key: string]: string } = {
  "01": "Январь",
  "02": "Февраль",
  "03": "Март",
  "04": "Апрель",
  "05": "Май",
  "06": "Июнь",
  "07": "Июль",
  "08": "Август",
  "09": "Сентябрь",
  "10": "Октябрь",
  "11": "Ноябрь",
  "12": "Декабрь",
};

const LastCashbacks: React.FC = () => {
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [orders, setOrders] = useState<CashbackOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new Api();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      // Устанавливаем куку session_id
      document.cookie = `session_id=${sessionId}; path=/; secure; samesite=Strict;`;
      console.log('Кука session_id установлена:', document.cookie);
    }
  }, [sessionId]);

  useEffect(() => {
    let didCancel = false;

    const fetchCashbackOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.cashbackOrders.cashbackOrdersList({
          headers: {
            'Content-Type': 'application/json',
            'Session-ID': sessionId, // Используем sessionId из куки
          },
          withCredentials: true,  // Передаем куки с запросом
        });
        if (!didCancel) {
          setOrders(response.data);
        }
      } catch (err) {
        if (!didCancel) {
          console.error('API Error:', err);
          setError('Не удалось загрузить данные.');
        }
      } finally {
        if (!didCancel) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchCashbackOrders();
    }

    return () => {
      didCancel = true;
    };
  }, [isAuthenticated, sessionId]);

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleString() : 'Не указана';

  const getMonthName = (month: string): string => {
    return monthNames[month] || 'Не указан';
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'formed':
        return 'Подтвержден';
      case 'draft':
        return 'Черновик';
      default:
        return status;
    }
  };

  const handleDetailsClick = (orderId: number) => {
    navigate(`/monthly_cashbacks/${orderId}`, {
      state: { readonly: true },
    });
  };

  return (
    <div className="last-cashbacks-page">
      <header className="mb-4">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS</div>
          </Link>
          <Navbar />
        </div>
      </header>
      <Breadcrumb
        items={[
          { label: 'Главная', path: '/' },
          { label: 'Список кешбэков', path: '/cashbacks' },
          { label: 'Прошлые кешбэки', path: '/past-cashbacks' },
        ]}
      />

      {!isAuthenticated ? (
        <div className="unauthorized-message">Пожалуйста, авторизуйтесь, чтобы увидеть прошлые кешбэки.</div>
      ) : loading ? (
        <div className="spinner">Загрузка...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : orders.length > 0 ? (
        <div className="cashbacks-table">
          <div className="table-header">
            <div>ID</div>
            <div>Статус</div>
            <div>Дата создания</div>
            <div>Дата формирования</div>
            <div>Дата завершения</div>
            <div>Месяц</div>
            <div>Всего потрачено</div>
            <div>Действия</div>
          </div>
          {orders.map((order) => (
            <div className="table-row" key={order.id}>
              <div>{order.id}</div>
              <div>{getStatusLabel(order.status)}</div>
              <div>{formatDate(order.creation_date)}</div>
              <div>{formatDate(order.formation_date)}</div>
              <div>{formatDate(order.completion_date)}</div>
              <div>{getMonthName(order.month)}</div>
              <div>{order.total_spent_month} руб.</div>
              <div>
                <button
                  className="details-button"
                  onClick={() => handleDetailsClick(order.id)}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Прошлые кешбэки не найдены.</div>
      )}
    </div>
  );
};

export default LastCashbacks;


