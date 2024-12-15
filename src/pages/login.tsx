import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Шапка
import Breadcrumb from '../components/BreadCrumbs';
import { Link, useNavigate } from 'react-router-dom'; // Навигация
import { useDispatch } from 'react-redux'; // Для обновления состояния Redux
import { login } from '../slices/authSlice'; // Action для входа
import { Api } from '../api/Api'; // Импортируем API
import '../assets/style.css'; // Стили
import axios, { AxiosResponse } from 'axios'; // Для уточнения типа ответа от сервера

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = new Api();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Отправляем запрос на сервер
      const response: AxiosResponse = await api.login.loginCreate(
        { email, password },
        { withCredentials: true } // Передаём куки вместе с запросом
      );

      console.log('Server response:', response); // Лог ответа сервера

      // Проверяем, возвращён ли session_id
      if (response.data && response.data.session_id) {
        console.log('Session ID from server:', response.data.session_id);

        // Сохраняем данные в Redux
        dispatch(login({ username: email, sessionId: response.data.session_id }));

        // Перенаправляем на главную страницу
        navigate('/');
      } else {
        setError('Не удалось войти. Проверьте данные и попробуйте снова.');
      }
    } catch (err) {
      console.error('Ошибка при авторизации:', err);

      if (axios.isAxiosError(err)) {
        console.error('Error details:', err.response?.data);
      }
      setError('Ошибка при авторизации. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Вход', path: '/login' },
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
        <h2>Вход</h2>
        <form onSubmit={handleLogin} className="auth-form">
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
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

















// import React, { useState } from 'react';
// import Navbar from '../components/Navbar'; // Шапка
// import Breadcrumb from '../components/BreadCrumbs'; // Хлебные крошки
// import { Link } from 'react-router-dom'; // Навигация
// import '../assets/style.css'; // Стили

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Email:', email, 'Password:', password);
//   };

//   const breadcrumbItems = [
//     { label: 'Главная', path: '/' },
//     { label: 'Вход', path: '/login' },
//   ];

//   return (
//     <div className="auth-page">
//       {/* Шапка */}
//       <header className="mb-4">
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           <Navbar />
//         </div>
//       </header>

//       {/* Хлебные крошки */}
//       <div className="breadcrumb-container">
//         <Breadcrumb items={breadcrumbItems} />
//       </div>

//       <div className="auth-container">
//         <h2>Вход</h2>
//         <form onSubmit={handleLogin} className="auth-form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             placeholder="Пароль"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             Войти
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

