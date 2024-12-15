import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Шапка
import Breadcrumb from '../components/BreadCrumbs'; // Хлебные крошки
import { Link } from 'react-router-dom'; // Навигация
import '../assets/style.css'; // Стили
import { Api } from '../api/Api'; // Импортируем сгенерированный API
import { AxiosResponse } from 'axios'; // Для уточнения типа ответа от сервера

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');

  const api = new Api();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response: AxiosResponse = await api.api.apiUserCreate({
        email,
        password,
      });

      if (response.status === 200) {
        setSuccess('Регистрация прошла успешно! Теперь вы можете войти.');
      } else {
        setError('Не удалось зарегистрировать пользователя. Попробуйте позже.');
      }
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте позже.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Регистрация', path: '/register' },
  ];

  return (
    <div className="auth-page">
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

      <div className="auth-container">
        <h2>Регистрация</h2>
        {success ? (
          <p className="success-message">{success}</p>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            {error && <p className="error-message">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;

