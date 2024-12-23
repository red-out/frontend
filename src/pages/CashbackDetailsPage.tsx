import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Импорт Navbar
import mockData from '../mocks/cashbackData'; // Импорт моковых данных
import Breadcrumb from '../components/BreadCrumbs';
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
      setError(null); // Сброс ошибки при новом запросе

      try {
        const response = await fetch(`/cashback_services/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных с бэкенда');
        const data = await response.json();
        if (data && data.id === Number(id)) {
          setService(data);
        } else {
          setService(null); // Если данных нет, возвращаем null
        }
      } catch (err) {
        const selectedService = mockData.find(service => service.id === Number(id));
        if (selectedService) {
          setService(selectedService); // Используем моковые данные при ошибке
        } else {
          setService(null); // Если моковых данных нет, также возвращаем null
        }
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]); // Зависимость только от `id`

  // Обработка состояния загрузки и ошибок
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!service) return <div>Нет данных для отображения.</div>;

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
          {/* Кликабельный MEGA BONUS */}
          <Link to="/" className="logo">
            <div className="mega">MEGA</div>
            <div className="bonus">BONUS</div>
          </Link>
          {/* Вставляем Navbar */}
          <Navbar />
        </div>
      </header>

      {/* Хлебные крошки под шапкой */}
      <div className="breadcrumb-container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container">
        <div className="cashback-details">
          <div className="cashback-det-details">
            <img src={service.image_url} alt={service.category} className="cashback-det-image" />
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















// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar'; // Импорт Navbar
// import mockData from '../mocks/cashbackData'; // Импорт моковых данных
// import Breadcrumb from '../components/BreadCrumbs';
// import '../assets/style.css';

// interface CashbackServiceDetail {
//   id: number;
//   category: string;
//   image_url: string;
//   cashback_percentage_text: string;
//   full_description: string;
//   details: string;
// }

// const CashbackDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [service, setService] = useState<CashbackServiceDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchServiceDetails();
//   }, [id]);

//   const fetchServiceDetails = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(`/cashback_services/${id}`);
//       if (!response.ok) throw new Error('Ошибка загрузки данных с бэкенда');
//       const data = await response.json();
//       if (data && data.id === Number(id)) {
//         setService(data);
//       } else {
//         setService(null); // Если данных нет, возвращаем null
//       }
//     } catch (err) {
//       const selectedService = mockData.find(service => service.id === Number(id));
//       if (selectedService) {
//         setService(selectedService); // Используем моковые данные при ошибке
//       } else {
//         setService(null); // Если моковых данных нет, также возвращаем null
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Загрузка...</div>;
//   if (!service) return <div>Нет данных для отображения.</div>;

//   const breadcrumbItems = [
//     { label: 'Главная', path: '/' },
//     { label: 'Список кешбэков', path: '/cashbacks' },
//     { label: service.category, path: '#' },
//   ];

//   return (
//     <div className="cashback-details-page">
//       {/* Шапка */}
//       <header className="mb-4">
//         <div className="header-content">
//           {/* Кликабельный MEGA BONUS */}
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           {/* Вставляем Navbar */}
//           <Navbar />
//         </div>
//       </header>

//       {/* Хлебные крошки под шапкой */}
//       <div className="breadcrumb-container">
//         <Breadcrumb items={breadcrumbItems} />
//       </div>

//       <div className="container">
//         <div className="cashback-details">
//           <div className="cashback-det-details">
//             <img src={service.image_url} alt={service.category} className="cashback-det-image" />
//             <div className="cashback-det-info">
//               <h2 className="cashback-det-title">{service.category}</h2>
//               <p className="cashback-det-description">{service.full_description}</p>
//               <p className="cashback-det-price">{service.details}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CashbackDetailsPage;




