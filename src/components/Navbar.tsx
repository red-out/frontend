import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { setSearchTerm } from '../slices/cashbackSlice';
import { Api } from '../api/Api';
import '../assets/style.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const api = new Api();

  const clearSessionCookie = () => {
    document.cookie = 'session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=Strict';
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      clearSessionCookie();
      dispatch(setSearchTerm(''));
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
  };

  const authLinks = (
    <>
      <li>
        <span className="header-link">{user?.username || 'Пользователь'}</span>
      </li>
      <li>
        <Link to="/profile" className="header-link">
          Профиль
        </Link>
      </li>
      <li>
        <Link to="/past_cashbacks" className="header-link">
          Прошлые кешбэки
        </Link>
      </li>
      <li>
        <Link to="/" className="header-link" onClick={handleLogout}>
          Выйти
        </Link>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/cashbacks" className="header-link">
          Кешбэки
        </Link>
      </li>
      <li>
        <Link to="/login" className="header-link">
          Вход
        </Link>
      </li>
      <li>
        <Link to="/register" className="header-link">
          Регистрация
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar">
      {/* Полное меню для компьютеров */}
      <ul className="desktop-menu">
        {isAuthenticated ? authLinks : guestLinks}
      </ul>

      {/* Бургер-меню для телефонов */}
      <button
        className="hamburger-button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        ☰
      </button>
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      )}
    </div>
  );
};

export default Navbar;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store';
// import { logout } from '../slices/authSlice';
// import { setSearchTerm } from '../slices/cashbackSlice';
// import { Api } from '../api/Api'; // Предполагается, что это ваша настроенная API-библиотека
// import '../assets/style.css';

// const Navbar: React.FC = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
//   const api = new Api();

//   const clearSessionCookie = () => {
//     document.cookie = 'session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=Strict';
//   };

//   const getSessionIdFromCookies = (): string | null => {
//     const matches = document.cookie.match(new RegExp('(^| )session_id=([^;]+)'));
//     return matches ? matches[2] : null;
//   };

//   const clearAllCashbacksInDraft = async () => {
//     const sessionId = getSessionIdFromCookies();
//     if (!sessionId) {
//       console.error('Session ID не найден');
//       return;
//     }

//     try {
//       console.log('Получение списка кешбэков и черновика...');
//       const servicesResponse = await api.cashbackServices.cashbackServicesList({
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });

//       if (!servicesResponse || !servicesResponse.data) {
//         console.warn('Ответ от API пустой или некорректный.');
//         return;
//       }

//       const services = Array.isArray(servicesResponse.data)
//         ? servicesResponse.data
//         : [];

//       const draftInfo = services.find((item: any) => item.draft_order_id !== undefined);
//       if (!draftInfo || !draftInfo.draft_order_id) {
//         console.warn('Черновик не найден.');
//         return;
//       }

//       const draftOrderId = draftInfo.draft_order_id;
//       console.log('ID черновика:', draftOrderId);

//       const draftDetailsResponse = await api.cashbackOrders.cashbackOrdersRead(draftOrderId, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-ID': sessionId,
//         },
//       });

//       if (!draftDetailsResponse || !draftDetailsResponse.data || !draftDetailsResponse.data.services) {
//         console.warn('Список услуг (services) отсутствует или некорректен.');
//         return;
//       }

//       const servicesToDelete = draftDetailsResponse.data.services;
//       console.log('Список кешбэков для удаления:', servicesToDelete);

//       if (servicesToDelete.length === 0) {
//         console.log('Нет кешбэков для удаления.');
//         return;
//       }

//       for (const service of servicesToDelete) {
//         console.log(`Попытка удалить кешбэк с service_id: ${service.service_id}`);
//         await api.cashbacksOrders.cashbacksOrdersServicesDeleteDelete(
//           draftOrderId,
//           String(service.service_id),
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Session-ID': sessionId,
//             },
//           }
//         );
//         console.log(`Кешбэк с service_id: ${service.service_id} успешно удален.`);
//       }
//     } catch (err) {
//       console.error('Ошибка при очистке кешбэков в черновике:', err);
//     }
//   };

//   useEffect(() => {
//     const handleOutsideClick = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('.navbar')) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener('click', handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener('click', handleOutsideClick);
//     };
//   }, [isDropdownOpen]);

//   const handleLogout = async () => {
//     try {
//       await clearAllCashbacksInDraft();
//       dispatch(logout());
//       clearSessionCookie();
//       dispatch(setSearchTerm(''));
//       setIsDropdownOpen(false);
//     } catch (err) {
//       console.error('Ошибка при выходе:', err);
//     }
//   };

//   const authLinks = (
//     <>
//       <li>
//         <span className="header-link">{user?.username || 'Пользователь'}</span>
//       </li>
//       <li>
//         <Link to="/profile" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//           Профиль
//         </Link>
//       </li>
//       <li>
//         <Link to="/past_cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//           Прошлые кешбэки
//         </Link>
//       </li>
//       <li>
//         <Link to="/" className="header-link" onClick={handleLogout}>
//           Выйти
//         </Link>
//       </li>
//     </>
//   );

//   const guestLinks = (
//     <>
//       <li>
//         <Link to="/cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//           Кешбэки
//         </Link>
//       </li>
//       <li>
//         <Link to="/login" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//           Вход
//         </Link>
//       </li>
//       <li>
//         <Link to="/register" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//           Регистрация
//         </Link>
//       </li>
//     </>
//   );

//   return (
//     <div className="navbar">
//       <button
//         className="hamburger-button"
//         onClick={() => setIsDropdownOpen((prev) => !prev)}
//       >
//         ☰
//       </button>
//       {isDropdownOpen && (
//         <ul className="dropdown-menu">
//           {isAuthenticated ? authLinks : guestLinks}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Navbar;









