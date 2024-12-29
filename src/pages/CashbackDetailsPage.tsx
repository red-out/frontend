import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Импорт Navbar
import Breadcrumb from '../components/BreadCrumbs';
import mockData from '../mocks/cashbackData'; // Импорт моковых данных
import '../assets/style.css';

interface CashbackServiceDetail {
  id: number;
  category: string;
  image_url: string;
  cashback_percentage_text: string;
  full_description: string;
  details: string;
}

const CashbackDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<CashbackServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/cashback_services/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных с сервера');
        const data = await response.json();
        setService(data);
      } catch (error) {
        const mockService = mockData.find(service => service.id === Number(id));
        if (mockService) {
          setService(mockService);
        } else {
          setError('Данные не найдены');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!service) {
    return <div>Нет данных для отображения.</div>;
  }

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Список кешбэков', path: '/cashbacks' },
    { label: service.category, path: '#' },
  ];

  return (
    <div className="cashback-details-page">
      {/* Шапка */}
      <header className="mb-4">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS</div>
          </Link>
          <Navbar />
        </div>
      </header>

      {/* Хлебные крошки */}
      <div className="breadcrumb-container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Детали кешбэка */}
      <div className="container">
        <div className="cashback-details">
          <div className="cashback-det-details">
            <img
              src={service.image_url}
              alt={service.category}
              className="cashback-det-image"
            />
            <div className="cashback-det-info">
              <h2 className="cashback-det-title">{service.category}</h2>
              <p className="cashback-det-description">{service.full_description}</p>
              <p className="cashback-det-price">{service.details}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackDetailsPage;


