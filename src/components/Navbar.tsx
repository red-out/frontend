import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';
import '../assets/style.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Закрытие меню при клике вне его
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

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  const authLinks = (
    <>
      <li>
        <span className="header-link">{user?.username || 'Пользователь'}</span>
      </li>
      <li>
        <Link to="/profile" className="header-link" onClick={() => setIsDropdownOpen(false)}>
          Профиль
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
        <Link to="/cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
          Кешбэки
        </Link>
      </li>
      <li>
        <Link to="/login" className="header-link" onClick={() => setIsDropdownOpen(false)}>
          Вход
        </Link>
      </li>
      <li>
        <Link to="/register" className="header-link" onClick={() => setIsDropdownOpen(false)}>
          Регистрация
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar">
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



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'; // Подключаем Redux хуки
// import { RootState } from '../store'; // Импорт типа RootState из store
// import { logout } from '../slices/authSlice'; // Импорт действия выхода
// import '../assets/style.css'; // Подключение общих стилей

// const Navbar: React.FC = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для гамбургера
//   const dispatch = useDispatch();

//   // Получаем данные из состояния auth
//   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

//   // Обработчик выхода
//   const handleLogout = () => {
//     dispatch(logout()); // Диспатчим logout
//     setIsDropdownOpen(false); // Закрываем меню
//   };

//   return (
//     <div className="navbar">
//       {/* Гамбургер с выпадающим меню */}
//       <button
//         className="hamburger-button"
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Переключаем состояние меню
//       >
//         ☰
//       </button>
//       {isDropdownOpen && (
//         <ul className="dropdown-menu">
//           {isAuthenticated ? (
//             <>
//               {/* Имя пользователя и кнопка выхода */}
//               <li>
//                 <span className="header-link">{user?.username || 'Пользователь'}</span>
//               </li>
//               <li>
//                 <button className="header-link" onClick={handleLogout}>
//                   Выйти
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               {/* Ссылки для гостя */}
//               <li>
//                 <Link to="/cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//                   Кешбэки
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/login" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//                   Вход
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/register" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//                   Регистрация
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Navbar;

