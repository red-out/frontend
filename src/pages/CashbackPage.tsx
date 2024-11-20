import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from "../components/BreadCrumbs";
import mockData from '../mocks/cashbackData'; 
import '../assets/style.css';

interface CashbackService {
  id: number;
  category: string;
  image_url: string;
  cashback_percentage_text: string;
  full_description: string;
  details: string;
}

const CashbackPage: React.FC = () => {
  const [services, setServices] = useState<CashbackService[]>([]); // Данные кешбэков
  const [filteredServices, setFilteredServices] = useState<CashbackService[]>([]); // Отфильтрованные сервисы
  const [searchTerm, setSearchTerm] = useState(''); // Строка поиска
  const [loading, setLoading] = useState(false); // Статус загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка загрузки

  useEffect(() => {
    fetchServices(); // Загружаем все сервисы при монтировании компонента
  }, []); // Загружаем данные один раз при монтировании

  const fetchServices = async (search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/cashback_services?search=${encodeURIComponent(search)}`); // Передаем параметр поиска
      if (!response.ok) throw new Error('Ошибка загрузки данных с бэкенда');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setServices(data); // Устанавливаем полученные данные
        setFilteredServices(data); // При первой загрузке все сервисы отображаются
      } else {
        setServices([]); // Если данные пустые, ставим пустой массив
        setFilteredServices([]); // И отфильтрованный массив пуст
      }
    } catch (err) {
      setServices(mockData); // Используем моковые данные при ошибке
      setFilteredServices(mockData); // И для моковых данных тоже
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices(searchTerm); // Передаем строку поиска на сервер для фильтрации
  };

  return (
    <div className="cashback-page">
      {/* Шапка */}
      <header className="mb-4">
        <div className="header-content">
          <div className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS </div>
          </div>
          {/* <p>Кешбэк сервис</p> */}
          {/* Кликабельные слова вместо кнопок */}
          <div className="header-links">
            <Link to="/" className="header-link">Главная</Link>
            <Link to="/cashbacks" className="header-link">Кешбэки</Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb для навигации */}
      <Breadcrumb items={[{ label: 'Главная', path: '/' }, { label: 'Список кешбэков', path: '/cashbacks' }]} />

      {/* Форма поиска */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск по названию"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            maxLength={50} // Ограничение длины текста
          />
          <button type="submit" className="search-button">Найти</button>
        </form>
      </div>

      {/* Загрузка и ошибки */}
      {loading && <div className="spinner">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      {/* Карточки кешбэков */}
      <div className="cards-container">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service.id} className="card">
              <Link to={`/cashback-details/${service.id}`} className="card-link">
                <div className="card-image-container">
                  <img
                    src={service.image_url}
                    alt={service.category}
                    className="card-image"
                  />
                </div>
                <h3>{service.category}</h3>
                <p>{service.cashback_percentage_text}</p>
              </Link>
              <button className="btn btn-secondary" disabled>Добавить в кешбэк</button>
            </div>
          ))
        ) : (
          <div>Кешбэк-услуги не найдены.</div>
        )}
      </div>
    </div>
  );
};

export default CashbackPage;



