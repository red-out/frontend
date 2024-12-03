import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style.css'; // Подключение общих стилей

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для гамбургера

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
          <li>
            <Link to="/cashbacks" className="header-link" onClick={() => setIsDropdownOpen(false)}>
              Кешбэки
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;

