import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from "../components/BreadCrumbs";
import Navbar from "../components/Navbar"; // Импорт нового компонента
import { setSearchTerm } from '../slices/cashbackSlice'; // Redux action для обновления searchTerm
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
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: any) => state.search.searchTerm); // Получаем searchTerm из хранилища Redux
  const [inputValue, setInputValue] = useState(searchTerm); // Локальное состояние для поля ввода
  const [filteredServices, setFilteredServices] = useState<CashbackService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices(searchTerm); // Вызов функции при инициализации компонента
  }, []); // Эффект без зависимости от searchTerm, чтобы выполнить запрос один раз при монтировании

  useEffect(() => {
    fetchServices(searchTerm); // Перезапрашиваем данные при изменении searchTerm
  }, [searchTerm]);

  const fetchServices = async (search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/cashback_services?search=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Ошибка загрузки данных с бэкенда');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setFilteredServices(data);
      } else {
        setFilteredServices([]);
      }
    } catch (err) {
      setFilteredServices(mockData); // В случае ошибки, используем mockData
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(inputValue)); // Обновляем searchTerm в Redux
    fetchServices(inputValue); // Выполняем поиск с текущим значением поля ввода
  };

  return (
    <div className="cashback-page">
      <header className="mb-4">
        <div className="header-content">
          {/* Кликабельный MEGA BONUS */}
          <Link to="/" className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS</div>
          </Link>
          {/* Встраиваем Navbar */}
          <Navbar />
        </div>
      </header>

      <Breadcrumb items={[{ label: 'Главная', path: '/' }, { label: 'Список кешбэков', path: '/cashbacks' }]} />

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск по названию"
            value={inputValue} // Используем локальное состояние для ввода
            onChange={(e) => setInputValue(e.target.value)} // Обновляем локальное состояние
            className="search-input"
            maxLength={50}
          />
          <button type="submit" className="search-button">Найти</button>
        </form>
      </div>

      {loading && <div className="spinner">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

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


