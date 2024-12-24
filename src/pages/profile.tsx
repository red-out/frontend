import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { updateUserInfo, logout } from "../slices/authSlice";
import { Api } from "../api/Api";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/BreadCrumbs";
import "../assets/style.css";

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = new Api();

  const [newEmail, setNewEmail] = useState<string>(user?.email || "");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!sessionId) {
        throw new Error("Не найден session_id. Пожалуйста, войдите снова.");
      }

      if (!user?.id) {
        throw new Error("Не найден ID пользователя. Пожалуйста, войдите снова.");
      }

      const userData = {
        email: newEmail,
        ...(newPassword && { password: newPassword }), // Добавляем пароль, если он указан
      };

      const response = await api.user.userUpdatePartialUpdate(user.id, userData);

      if (response) {
        // Очищаем состояние авторизации
        dispatch(logout());
        setSuccess("Данные успешно обновлены! Пожалуйста, войдите заново.");
        // Перенаправляем пользователя на страницу входа
        setTimeout(() => navigate("/login"), 2000); // Небольшая задержка для отображения сообщения
      } else {
        throw new Error("Ошибка при обновлении данных.");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении данных.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Главная", path: "/" },
    { label: 'Список кешбэков', path: '/cashbacks' },
    { label: "Профиль", path: "/profile" },
  ];

  return (
    <div className="auth-page">
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
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="auth-container">
        <h2>Личный кабинет</h2>
        <p>Добро пожаловать, {user?.username || "вы изменили свои данные"}!</p>
        <form onSubmit={handleUpdateUser} className="auth-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

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
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Загрузка..." : "Обновить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
