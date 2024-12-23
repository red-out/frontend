import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/BreadCrumbs';
import '../assets/style.css';
import { Api } from '../api/Api';

const MonthlyCashbacksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const draftOrderId = searchParams.get('draft_order_id');
  const [cashbackServices, setCashbackServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedData = useRef(false);

  const api = new Api();

  const getSessionIdFromCookies = (): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'session_id') {
        return value;
      }
    }
    console.warn('Session-ID не найден в куках');
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
        const { services } = response.data;
        setCashbackServices(services || []);
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTotalSpent = async (serviceId: number, newTotalSpent: number) => {
    const sessionId = getSessionIdFromCookies();
    if (!draftOrderId || !sessionId) {
      setError('Не удалось получить session_id или черновик заказа.');
      return;
    }

    setLoading(true);
    try {
      const updatedService = {
        total_spent: newTotalSpent,
      };

      await api.cashbacksOrders.cashbacksOrdersServicesUpdateUpdate(
        draftOrderId,
        String(serviceId),
        updatedService,
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-ID': sessionId,
          },
        }
      );

      setCashbackServices((prevServices) =>
        prevServices.map((service) =>
          service.service_id === serviceId
            ? { ...service, total_spent: newTotalSpent }
            : service
        )
      );
    } catch (err) {
      console.error('Ошибка при обновлении общей суммы трат:', err);
      setError('Ошибка при обновлении общей суммы трат.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    const sessionId = getSessionIdFromCookies();
    if (!draftOrderId || !sessionId) {
      setError('Не удалось получить session_id или черновик заказа.');
      return;
    }

    setLoading(true);
    try {
      await api.cashbacksOrders.cashbacksOrdersServicesDeleteDelete(draftOrderId, String(serviceId), {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });
      setCashbackServices((prevServices) =>
        prevServices.filter((service) => service.service_id !== serviceId)
      );
    } catch (err) {
      console.error('Ошибка при удалении услуги:', err);
      setError('Ошибка при удалении услуги.');
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
            { label: 'Список кешбэков', path: '/cashbacks' },
            { label: 'Мои кешбэки', path: '/monthly_cashbacks' },
          ]}
        />
      </div>

      {loading && <div className="spinner">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      {draftOrderId ? (
        <div className="centered-text-monthly-cashbacks">
          <h3>Ваш черновик заказа кешбэков</h3>
        </div>
      ) : (
        <div>У вас нет черновика заказа кешбэков.</div>
      )}

      <div className="cards-container-monthly-cashbacks">
        {Array.isArray(cashbackServices) && cashbackServices.length > 0 ? (
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
                <input
                  type="number"
                  value={service.total_spent}
                  onChange={(e) =>
                    setCashbackServices((prevServices) =>
                      prevServices.map((s) =>
                        s.service_id === service.service_id
                          ? { ...s, total_spent: Number(e.target.value) }
                          : s
                      )
                    )
                  }
                  onBlur={() => handleUpdateTotalSpent(service.service_id, service.total_spent)}
                  className="total-spent-input"
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteService(service.service_id)}
                >
                  Удалить из кешбэка
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>У вас нет кешбэков в черновике.</div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCashbacksPage;






// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Breadcrumb from '../components/BreadCrumbs';
// import '../assets/style.css';
// import { Api } from '../api/Api'; // Предположительно, путь к API-клиенту

// const MonthlyCashbacksPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const draftOrderId = searchParams.get('draft_order_id');
//   const [cashbackServices, setCashbackServices] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const hasFetchedData = useRef(false); // Флаг для предотвращения лишних запросов

//   const api = new Api(); // Инициализация API-клиента

//   const getSessionIdFromCookies = (): string | null => {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [key, value] = cookie.trim().split('=');
//       if (key === 'session_id') {
//         return value;
//       }
//     }
//     console.warn('Session-ID не найден в куках');
//     return null;
//   };

//   useEffect(() => {
//     if (draftOrderId && !hasFetchedData.current) {
//       fetchMonthlyCashbacks();
//       hasFetchedData.current = true;
//     }
//   }, [draftOrderId]);

//   const fetchMonthlyCashbacks = async () => {
//     const sessionId = getSessionIdFromCookies();
//     if (!sessionId) {
//       setError('Не удалось получить session_id из куков');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.cashbackOrders.cashbackOrdersRead(draftOrderId, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });

//       if (response.data) {
//         const { services } = response.data;
//         setCashbackServices(services || []);
//       }
//     } catch (err) {
//       console.error('Ошибка при загрузке данных:', err);
//       setError('Ошибка при загрузке данных.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteService = async (serviceId: number) => {
//     const sessionId = getSessionIdFromCookies();
//     if (!draftOrderId || !sessionId) {
//       setError('Не удалось получить session_id или черновик заказа.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.cashbacksOrders.cashbacksOrdersServicesDeleteDelete(draftOrderId, String(serviceId), {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });
//       // Убираем удалённую услугу из состояния
//       setCashbackServices((prevServices) =>
//         prevServices.filter((service) => service.service_id !== serviceId)
//       );
//     } catch (err) {
//       console.error('Ошибка при удалении услуги:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="monthly-cashbacks-page">
//       <header className="mb-4">
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           <Navbar />
//         </div>
//       </header>

//       <div className="breadcrumb-container">
//         <Breadcrumb
//           items={[
//             { label: 'Главная', path: '/' },
//             { label: 'Список кешбэков', path: '/cashbacks' },
//             { label: 'Мои кешбэки', path: '/monthly_cashbacks' },
//           ]}
//         />
//       </div>

//       {loading && <div className="spinner">Загрузка...</div>}
//       {error && <div className="error">{error}</div>}

//       {draftOrderId ? (
//         <div className="centered-text-monthly-cashbacks">
//           <h3>Ваш черновик заказа кешбэков</h3>
//         </div>
//       ) : (
//         <div>У вас нет черновика заказа кешбэков.</div>
//       )}

//       <div className="cards-container-monthly-cashbacks">
//         {Array.isArray(cashbackServices) && cashbackServices.length > 0 ? (
//           cashbackServices.map((service) => (
//             <div key={service.service_id} className="card-monthly-cashbacks">
//               <div className="card-image-container-monthly-cashbacks">
//                 <img
//                   src={service.image_url || '/images/default.png'}
//                   alt={service.category}
//                   className="card-image-monthly-cashbacks"
//                 />
//               </div>
//               <h3>{service.category}</h3>
//               <p>{service.cashback_percentage_text || ''}</p>
//               <button
//                 className="delete-button"
//                 onClick={() => handleDeleteService(service.service_id)}
//               >
//                 Удалить
//               </button>
//             </div>
//           ))
//         ) : (
//           <div>У вас нет кешбэков в черновике.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MonthlyCashbacksPage;

















// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Breadcrumb from '../components/BreadCrumbs';
// import '../assets/style.css';
// import { Api } from '../api/Api'; // Предположительно, путь к API-клиенту

// const MonthlyCashbacksPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const draftOrderId = searchParams.get('draft_order_id');
//   const [cashbackServices, setCashbackServices] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const hasFetchedData = useRef(false); // Флаг для предотвращения лишних запросов

//   const api = new Api(); // Инициализация API-клиента

//   const getSessionIdFromCookies = (): string | null => {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [key, value] = cookie.trim().split('=');
//       if (key === 'session_id') {
//         return value;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (draftOrderId && !hasFetchedData.current) {
//       fetchMonthlyCashbacks();
//       hasFetchedData.current = true;
//     }
//   }, [draftOrderId]);

//   const fetchMonthlyCashbacks = async () => {
//     const sessionId = getSessionIdFromCookies();
//     if (!sessionId) {
//       setError('Не удалось получить session_id из куков');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.cashbackOrders.cashbackOrdersRead(draftOrderId, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });

//       if (response.data) {
//         const { services } = response.data;
//         setCashbackServices(services || []);
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Ошибка при загрузке данных.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="monthly-cashbacks-page">
//       <header className="mb-4">
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           <Navbar />
//         </div>
//       </header>

//       <div className="breadcrumb-container">
//         <Breadcrumb
//           items={[
//             { label: 'Главная', path: '/' },
//             { label: 'Список кешбэков', path: '/cashbacks' }, // Пункт "Список кешбэков"
//             { label: 'Мои кешбэки', path: '/monthly_cashbacks' },
//           ]}
//         />
//       </div>

//       {loading && <div className="spinner">Загрузка...</div>}
//       {error && <div className="error">{error}</div>}

//       {draftOrderId ? (
//         <div className="centered-text-monthly-cashbacks">
//           <h3>Ваш черновик заказа кешбэков</h3>
//         </div>
//       ) : (
//         <div>У вас нет черновика заказа кешбэков.</div>
//       )}

//       <div className="cards-container-monthly-cashbacks">
//         {Array.isArray(cashbackServices) && cashbackServices.length > 0 ? (
//           cashbackServices.map((service) => (
//             <div key={service.id} className="card-monthly-cashbacks">
//               <div className="card-image-container">
//                 <img
//                   src={service.image_url || '/images/default.png'}
//                   alt={service.category}
//                   className="card-image"
//                 />
//               </div>
//               <h3>{service.category}</h3>
//               <p>{service.cashback_percentage_text}</p>
//               <p>{service.full_description}</p>
//             </div>
//           ))
//         ) : (
//           <div>У вас нет кешбэков в черновике.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MonthlyCashbacksPage;


