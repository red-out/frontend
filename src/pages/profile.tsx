import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Шапка
import Breadcrumb from '../components/BreadCrumbs'; // Хлебные крошки
import { Link, useNavigate } from 'react-router-dom'; // Навигация
import '../assets/style.css'; // Стили
import { useDispatch, useSelector } from 'react-redux'; // Для работы с Redux
import { RootState } from '../store'; // Для типизации состояния
import { updateUserDetails } from '../slices/userSlice'; // Импортируем thunk


const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state: RootState) => state.user); // Извлекаем данные из Redux

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNewEmail(user.email);
    }
  }, [user]);

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSuccess(null);
      dispatch(updateUserDetails.rejected({ payload: 'Пароли не совпадают' }));
      return;
    }

    const userData = {
      email: newEmail,
      ...(newPassword && { password: newPassword }),
    };

    if (user?.id) {
      dispatch(updateUserDetails({ userId: user.id, userData }))
        .then((action) => {
          if (action.type === 'user/updateUserDetails/fulfilled') {
            setSuccess('Данные успешно обновлены!');
            setTimeout(() => navigate('/'), 2000); // Перенаправление на главную через 2 секунды
          }
        });
    }
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Список кешбэков', path: '/cashbacks' },
    { label: 'Профиль', path: '/profile' },
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
        <h2>Личный кабинет</h2>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleUpdateUser} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Пароль (если нужно изменить)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Загрузка...' : 'Обновить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

