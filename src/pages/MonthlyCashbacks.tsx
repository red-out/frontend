import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/BreadCrumbs';
import '../assets/style.css';
import { Api } from '../api/Api';
import { useNavigate } from 'react-router-dom';

const MonthlyCashbacksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const draftOrderId = searchParams.get('draft_order_id');
  const readonly = location.state?.readonly || false; // Проверка режима только для чтения
  const [cashbackServices, setCashbackServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();
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

  const handleConfirm = async () => {
    if (!draftOrderId || !selectedMonth) {
      setError('Пожалуйста, выберите месяц и убедитесь, что черновик заказа доступен.');
      return;
    }

    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      setError('Не удалось получить session_id.');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        month: selectedMonth,
        status: 'formed' as const,
      };

      await api.cashbackOrders.cashbackOrdersUpdateUpdate(draftOrderId, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });

      navigate('/cashbacks');
    } catch (err) {
      console.error('Ошибка при подтверждении кешбэка:', err);
      setError('Ошибка при подтверждении кешбэка.');
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
          <h3>Выбранные категории за этот месяц</h3>

          {!readonly && (
            <div className="month-selection">
              <label htmlFor="month-select">Выберите месяц:</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
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
          )}
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
                {readonly ? (
                  <div>Потрачено: {service.total_spent} руб.</div>
                ) : (
                  <>
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
                  </>
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


// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Breadcrumb from '../components/BreadCrumbs';
// import '../assets/style.css';
// import { Api } from '../api/Api';
// import { useNavigate } from 'react-router-dom';

// const MonthlyCashbacksPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const draftOrderId = searchParams.get('draft_order_id');
//   const [cashbackServices, setCashbackServices] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedMonth, setSelectedMonth] = useState<string>('');
//   const hasFetchedData = useRef(false);
//   const navigate = useNavigate();
//   const api = new Api();

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

//   const handleUpdateTotalSpent = async (serviceId: number, newTotalSpent: number) => {
//     const sessionId = getSessionIdFromCookies();
//     if (!draftOrderId || !sessionId) {
//       setError('Не удалось получить session_id или черновик заказа.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const updatedService = {
//         total_spent: newTotalSpent,
//       };

//       await api.cashbacksOrders.cashbacksOrdersServicesUpdateUpdate(
//         draftOrderId,
//         String(serviceId),
//         updatedService,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Session-ID': sessionId,
//           },
//         }
//       );

//       setCashbackServices((prevServices) =>
//         prevServices.map((service) =>
//           service.service_id === serviceId
//             ? { ...service, total_spent: newTotalSpent }
//             : service
//         )
//       );
//     } catch (err) {
//       console.error('Ошибка при обновлении общей суммы трат:', err);
//       setError('Ошибка при обновлении общей суммы трат.');
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
//       setCashbackServices((prevServices) =>
//         prevServices.filter((service) => service.service_id !== serviceId)
//       );
//     } catch (err) {
//       console.error('Ошибка при удалении услуги:', err);
//       setError('Ошибка при удалении услуги.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = async () => {
//     if (!draftOrderId || !selectedMonth) {
//       setError('Пожалуйста, выберите месяц и убедитесь, что черновик заказа доступен.');
//       return;
//     }

//     const sessionId = getSessionIdFromCookies();
//     if (!sessionId) {
//       setError('Не удалось получить session_id.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const updateData = {
//         month: selectedMonth,
//         status: 'formed' as const,
//       };

//       await api.cashbackOrders.cashbackOrdersUpdateUpdate(draftOrderId, updateData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });

//       navigate('/cashbacks'); 
//     } catch (err) {
//       console.error('Ошибка при подтверждении кешбэка:', err);
//       setError('Ошибка при подтверждении кешбэка.');
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
//   <div className="centered-text-monthly-cashbacks">
//     <h3>Выбранные категории за этот месяц</h3>

//     <div className="month-selection">
//       <label htmlFor="month-select">Выберите месяц:</label>
//       <select
//         id="month-select"
//         value={selectedMonth}
//         onChange={(e) => setSelectedMonth(e.target.value)}
//       >
//         <option value="">-- Выберите месяц --</option>
//         {Array.from({ length: 12 }, (_, index) => (
//           <option key={index + 1} value={String(index + 1).padStart(2, '0')}>
//             {new Date(0, index).toLocaleString('ru', { month: 'long' })}
//           </option>
//         ))}
//       </select>

//       <button className="confirm-button" onClick={handleConfirm} disabled={!selectedMonth}>
//         Подтвердить
//       </button>
//     </div>
//   </div>
// ) : (
//   <div>У вас нет черновика заказа кешбэков.</div>
// )}

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
//               <div className="card-actions">
//                 <input
//                   type="number"
//                   value={service.total_spent}
//                   onChange={(e) =>
//                     setCashbackServices((prevServices) =>
//                       prevServices.map((s) =>
//                         s.service_id === service.service_id
//                           ? { ...s, total_spent: Number(e.target.value) }
//                           : s
//                       )
//                     )
//                   }
//                   onBlur={() => handleUpdateTotalSpent(service.service_id, service.total_spent)}
//                   className="total-spent-input"
//                 />
//                 <button
//                   className="delete-button"
//                   onClick={() => handleDeleteService(service.service_id)}
//                 >
//                   Удалить из кешбэка
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div>У вас нет выбранных категорий.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MonthlyCashbacksPage;
