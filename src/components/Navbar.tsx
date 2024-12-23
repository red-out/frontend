import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { setSearchTerm } from '../slices/cashbackSlice'; // Импорт для сброса строки поиска
import '../assets/style.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Удаление куки при выходе
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

  const handleLogout = () => {
    dispatch(logout());
    clearSessionCookie(); // Удаление куки
    dispatch(setSearchTerm('')); // Сброс строки поиска
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

