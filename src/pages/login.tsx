import React, { useState } from "react";
import { Api } from "../api/Api"; // Импортируем API
import { useDispatch } from "react-redux"; // Для обновления состояния Redux
import { login } from "../slices/authSlice"; // Action для сохранения логина
import Navbar from "../components/Navbar"; // Импортируем Navbar
import Breadcrumb from '../components/BreadCrumbs'; // Импортируем Breadcrumb
import { useNavigate } from "react-router-dom"; // Для навигации после успешного входа
import "../assets/style.css"; // Импортируем стили

const Login = () => {
  const [email, setEmail] = useState<string>(""); // Поле email
  const [password, setPassword] = useState<string>(""); // Поле пароля
  const [error, setError] = useState<string>(""); // Ошибка
  const [loading, setLoading] = useState<boolean>(false); // Состояние загрузки

  const dispatch = useDispatch(); // Используем dispatch для обновления Redux
  const api = new Api(); // Создаем экземпляр API
  const navigate = useNavigate(); // Хук для навигации

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.login.loginCreate({ email, password });

      if (response.data?.session_id) {
        dispatch(login({ username: email, sessionId: response.data.session_id }));
        
        // Устанавливаем куки с сессионным ID
        document.cookie = `sessionid=${response.data.session_id}; path=/; SameSite=Strict; Secure`;

        navigate("/"); // Перенаправляем на главную страницу после успешного входа
      } else {
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      setError("Ошибка при аутентификации. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb items={[{ label: "Главная", path: "/" }, { label: "Вход", path: "/login" }]} />
      <div className="register-container">
        <h2>Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </>
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

