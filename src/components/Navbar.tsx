import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Подключаем Redux хуки
import { RootState } from '../store'; // Импорт типа RootState из store
import { logout } from '../slices/authSlice'; // Импорт действия выхода
import '../assets/style.css'; // Подключение общих стилей

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для гамбургера
  const dispatch = useDispatch();

  // Получаем данные из состояния auth
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Обработчик выхода
  const handleLogout = () => {
    dispatch(logout()); // Диспатчим logout
    setIsDropdownOpen(false); // Закрываем меню
  };

  return (
    <div className="navbar">
      {/* Гамбургер с выпадающим меню */}
      <button
        className="hamburger-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Переключаем состояние меню
      >
        ☰
      </button>
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {isAuthenticated ? (
            <>
              {/* Имя пользователя и кнопка выхода */}
              <li>
                <span className="header-link">{user?.username || 'Пользователь'}</span>
              </li>
              <li>
                <button className="header-link" onClick={handleLogout}>
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Ссылки для гостя */}
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
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../assets/style.css'; // Подключение общих стилей

// const Navbar: React.FC = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для гамбургера

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
//           <li>
//             <Link to="/cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//               Кешбэки
//             </Link>
//           </li>
//           <li>
//             <Link to="/login" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//               Вход
//             </Link>
//           </li>
//           <li>
//             <Link to="/register" className="header-link" onClick={() => setIsDropdownOpen(false)}>
//               Регистрация
//             </Link>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Navbar;

