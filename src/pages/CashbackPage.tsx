import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from "../components/BreadCrumbs";
import Navbar from "../components/Navbar"; // Импорт нового компонента
import { setSearchTerm } from '../slices/cashbackSlice'; // Redux action для обновления searchTerm
import mockData from '../mocks/cashbackData';
import '../assets/style.css';
import { dest_api } from '../target_config'
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
      const response = await fetch(`${dest_api}/cashback_services?search=${encodeURIComponent(search)}`);
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



// import React, { useEffect, useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import Breadcrumb from "../components/BreadCrumbs";
// import Navbar from "../components/Navbar";
// import { setSearchTerm } from '../slices/cashbackSlice';
// import { Api } from "../api/Api";
// import axios from 'axios';
// import '../assets/style.css';

// interface CashbackService {
//   id: number;
//   category: string;
//   image_url: string;
//   cashback_percentage_text: string;
//   full_description: string;
//   details: string;
// }

// const CashbackPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const searchTerm = useSelector((state: any) => state.search.searchTerm);
//   const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
//   const sessionId = useSelector((state: any) => state.auth.sessionId);
//   const [inputValue, setInputValue] = useState(searchTerm);
//   const [filteredServices, setFilteredServices] = useState<CashbackService[]>([]);
//   const [cashbacksCount, setCashbacksCount] = useState<number>(0);
//   const [draftOrderId, setDraftOrderId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const firstRender = useRef(true);
//   const api = new Api();

//   useEffect(() => {
//     if (sessionId) {
//       document.cookie = `session_id=${sessionId}; path=/; secure; samesite=Strict`;
//       console.log('Кука session_id установлена:', document.cookie);
//     }
//   }, [sessionId]);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       document.cookie = `session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
//       console.log('Кука session_id удалена');
//     }
//   }, [isAuthenticated]);

//   const fetchData = async (search: string = '') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`/cashback_services`, {
//         params: { search },
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true,
//       });

//       const data = response.data;

//       setFilteredServices(data.filter((item: any) => item.id) || []);
//       const draftOrder = data.find((item: any) => item.draft_order_id);
//       setDraftOrderId(draftOrder ? draftOrder.draft_order_id : null);
//       setCashbacksCount(draftOrder ? draftOrder.cashbacks_count : 0);
//     } catch (err) {
//       console.error(err);
//       setError('Не удалось загрузить данные.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!firstRender.current) {
//       fetchData(searchTerm);
//     } else {
//       firstRender.current = false;
//     }
//   }, [searchTerm]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(setSearchTerm(inputValue));
//     fetchData(inputValue);
//   };

//   const handleAddToDraft = async (serviceId: number) => {
//     try {
//       await api.cashbackServices.cashbackServicesAddToDraftCreate(String(serviceId), {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });
//       fetchData(inputValue); // Обновляем данные после успешного добавления
//     } catch (error: any) {
//       if (error.response && error.response.status === 409) {
//         alert('Категория уже добавлена!');
//       } else {
//         console.error(error);
//         alert('Категория уже добавлена!');
//       }
//     }
//   };

//   return (
//     <div className="cashback-page">
//       <header className="mb-4">
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           <Navbar />
//         </div>
//       </header>

//       <Breadcrumb items={[{ label: 'Главная', path: '/' }, { label: 'Список кешбэков', path: '/cashbacks' }]} />

//       <div className="search-container">
//         <form onSubmit={handleSearch} className="search-form">
//           <input
//             type="text"
//             placeholder="Поиск по названию"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="search-input"
//             maxLength={50}
//           />
//           <button type="submit" className="search-button">Найти</button>
//           <Link
//             to={draftOrderId ? `/monthly_cashbacks?draft_order_id=${draftOrderId}` : '#'}
//             className={`search-button link-button ${!isAuthenticated || !draftOrderId ? 'btn-disabled' : ''}`}
//             style={{ pointerEvents: isAuthenticated && draftOrderId ? 'auto' : 'none' }}
//           >
//             Ваши кешбэки{cashbacksCount ? `: ${cashbacksCount}` : ''}
//           </Link>
//         </form>
//       </div>

//       {loading && <div className="spinner">Загрузка...</div>}
//       {error && <div className="error">{error}</div>}

//       <div className="cards-container">
//         {filteredServices.length > 0 ? (
//           filteredServices.map(service => (
//             <div key={service.id} className="card">
//               <Link to={`/cashback-details/${service.id}`} className="card-link">
//                 <div className="card-image-container">
//                   <img
//                     src={service.image_url}
//                     alt={service.category}
//                     className="card-image"
//                   />
//                 </div>
//                 <h3>{service.category}</h3>
//                 <p>{service.cashback_percentage_text}</p>
//               </Link>
//               <button
//                 className={`btn btn-secondary ${!isAuthenticated ? 'btn-disabled' : ''}`}
//                 onClick={() => handleAddToDraft(service.id)}
//                 disabled={!isAuthenticated}
//                 style={{ pointerEvents: isAuthenticated ? 'auto' : 'none' }}
//               >
//                 Добавить в кешбэк
//               </button>
//             </div>
//           ))
//         ) : (
//           <div>Кешбэк-услуги не найдены.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CashbackPage;

