import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/BreadCrumbs';
import '../assets/style.css';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMonthlyCashbacks, setSelectedMonth, confirmMonthSelection } from '../slices/monthlyCashbacksSlice';

const MonthlyCashbacksPage: React.FC = () => {
  const { draft_order_id } = useParams();
  const location = useLocation();
  const readonly = location.state?.readonly || false;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cashbackServices = [], loading, error, selectedMonth } = useAppSelector(
    (state) => state.cashbacks || {}
  );

  useEffect(() => {
    if (draft_order_id) {
      dispatch(fetchMonthlyCashbacks(draft_order_id));
    }
  }, [dispatch, draft_order_id]);

  const handleConfirm = () => {
    if (!draft_order_id || !selectedMonth) {
      alert('Пожалуйста, выберите месяц.');
      return;
    }

    // Отправка выбранного месяца на сервер
    dispatch(confirmMonthSelection(selectedMonth))
      .then(() => {
        // Если успешный запрос, выполняем редирект
        navigate('/cashbacks');
      })
      .catch((error) => {
        console.error('Ошибка при отправке данных на сервер', error);
      });
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
            { label: 'Список кешбэков', path: '/cashbacks' },
            { label: 'Мои кешбэки', path: '/monthly_cashbacks' },
          ]}
        />
      </div>

      {loading && <div className="spinner">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      <div className="month-selection">
        <label htmlFor="month-select">Выберите месяц:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
        >
          <option value="">-- Выберите месяц --</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={String(index + 1).padStart(2, '0')}>
              {new Date(0, index).toLocaleString('ru', { month: 'long' })}
            </option>
          ))}
        </select>

        <button className="confirm-button" onClick={handleConfirm} disabled={!selectedMonth}>
          Подтвердить
        </button>
      </div>

      <div className="cards-container-monthly-cashbacks">
        {cashbackServices.length > 0 ? (
          cashbackServices.map((service) => (
            <div key={service.service_id} className="card-monthly-cashbacks">
              <div className="card-image-container-monthly-cashbacks">
                <img
                  src={service.image_url || '/images/default.png'}
                  alt={service.category}
                  className="card-image-monthly-cashbacks"
                />
              </div>
              <h3>{service.category}</h3>
              <div className="card-actions">
                {readonly ? (
                  <div>Потрачено: {service.total_spent} руб.</div>
                ) : (
                  <div>Редактирование данных</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>У вас нет выбранных категорий.</div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCashbacksPage;
