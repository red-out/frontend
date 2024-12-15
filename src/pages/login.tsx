import { useState } from "react";
import { Api } from "../api/Api"; // Импортируем API
import Navbar from "../components/Navbar"; // Импортируем Navbar
import Breadcrumb from "../components/BreadCrumbs"; // Импортируем Breadcrumb
import { useNavigate } from "react-router-dom"; // Для навигации после успешного входа
import "../assets/style.css"; // Импортируем стили

const Login = () => {
  const [email, setEmail] = useState<string>(""); // Поле email
  const [password, setPassword] = useState<string>(""); // Поле пароля
  const [error, setError] = useState<string>(""); // Ошибка
  const [loading, setLoading] = useState<boolean>(false); // Состояние загрузки

  const api = new Api(); // Создаем экземпляр API
  const navigate = useNavigate(); // Хук для навигации

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Форма отправлена");

    try {
      console.log("Отправка запроса на сервер с email:", email, " и паролем:", password);
      const response = await api.login.loginCreate(
        { email, password },
        { withCredentials: true } // Передача куки с запросом
      );

      console.log("Ответ от сервера:", response);
      
      if (response.data?.session_id) {
        console.log("Успешный ответ от сервера. Сессия установлена.");
        document.cookie = `sessionid=${response.data.session_id}; path=/; SameSite=Strict`;
        navigate("/"); // Перенаправляем на главную страницу после успешного входа
      } else {
        console.log("Не удалось войти. Ответ от сервера без session_id:", response.data);
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      console.error("Ошибка при аутентификации:", err);
      setError("Ошибка при аутентификации. Попробуйте позже.");
    } finally {
      setLoading(false);
      console.log("Загрузка завершена.");
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Главная", path: "/" },
          { label: "Вход", path: "/login" },
        ]}
      />
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



// import { useState } from "react";
// // import React from 'react';
// import { Api } from "../api/Api"; // Импортируем API
// import Navbar from "../components/Navbar"; // Импортируем Navbar
// import Breadcrumb from "../components/BreadCrumbs"; // Импортируем Breadcrumb
// import { useNavigate } from "react-router-dom"; // Для навигации после успешного входа
// import "../assets/style.css"; // Импортируем стили

// const Login = () => {
//   const [email, setEmail] = useState<string>(""); // Поле email
//   const [password, setPassword] = useState<string>(""); // Поле пароля
//   const [error, setError] = useState<string>(""); // Ошибка
//   const [loading, setLoading] = useState<boolean>(false); // Состояние загрузки

//   const api = new Api(); // Создаем экземпляр API
//   const navigate = useNavigate(); // Хук для навигации

//   // Обработчик отправки формы
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.login.loginCreate(
//         { email, password },
//         { withCredentials: true } // Передача куки с запросом
//       );

//       if (response.data?.session_id) {
//         // Кука устанавливается сервером, проверяем только успешность ответа
//         navigate("/"); // Перенаправляем на главную страницу после успешного входа
//       } else {
//         setError("Не удалось войти. Проверьте данные и попробуйте снова.");
//       }
//     } catch (err) {
//       setError("Ошибка при аутентификации. Попробуйте позже.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Breadcrumb
//         items={[
//           { label: "Главная", path: "/" },
//           { label: "Вход", path: "/login" },
//         ]}
//       />
//       <div className="register-container">
//         <h2>Вход в систему</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="error-message">{error}</p>}

//           <div className="input-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="input-field"
//             />
//           </div>

//           <div className="input-group">
//             <label htmlFor="password">Пароль</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="input-field"
//             />
//           </div>

//           <button type="submit" disabled={loading} className="submit-btn">
//             {loading ? "Загрузка..." : "Войти"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Login;















// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar'; // Шапка
// import Breadcrumb from '../components/BreadCrumbs';
// import { Link, useNavigate } from 'react-router-dom'; // Навигация
// import { useDispatch } from 'react-redux'; // Для обновления состояния Redux
// import { login } from '../slices/authSlice'; // Action для входа
// import { Api } from '../api/Api'; // Импортируем API
// import '../assets/style.css'; // Стили
// import axios, { AxiosResponse } from 'axios'; // Для уточнения типа ответа от сервера

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const api = new Api();

//   useEffect(() => {
//     // Проверка куков после загрузки компонента
//     const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//       const [key, value] = cookie.split('=');
//       acc[key] = value;
//       return acc;
//     }, {} as Record<string, string>);

//     console.log('Куки:', cookies);

//     if (cookies['session_id']) {
//       console.log('session_id:', cookies['session_id']);
//     } else {
//       console.log('session_id не найден в куках');
//     }

//     if (cookies['csrftoken']) {
//       console.log('csrfmiddlewaretoken:', cookies['csrftoken']);
//     } else {
//       console.log('csrfmiddlewaretoken не найден в куках');
//     }
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Отправляем запрос на сервер
//       const response: AxiosResponse = await api.login.loginCreate(
//         { email, password },
//         { withCredentials: true } // Передаём куки вместе с запросом
//       );

//       console.log('Server response:', response); // Лог ответа сервера

//       // Проверяем, возвращён ли session_id
//       if (response.data && response.data.session_id) {
//         console.log('Session ID from server:', response.data.session_id);

//         // Устанавливаем куки вручную
//         document.cookie = `session_id=${response.data.session_id}; path=/; SameSite=Lax; Secure;`;

//         // Сохраняем данные в Redux
//         dispatch(login({ username: email, sessionId: response.data.session_id }));

//         // Перенаправляем на главную страницу
//         navigate('/');
//       } else {
//         setError('Не удалось войти. Проверьте данные и попробуйте снова.');
//       }
//     } catch (err) {
//       console.error('Ошибка при авторизации:', err);

//       if (axios.isAxiosError(err)) {
//         console.error('Error details:', err.response?.data);
//       }
//       setError('Ошибка при авторизации. Попробуйте позже.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const breadcrumbItems = [
//     { label: 'Главная', path: '/' },
//     { label: 'Вход', path: '/login' },
//   ];

//   return (
//     <div className="auth-page">
//       <header className="mb-4">
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <div className="mega">MEGA</div>
//             <div className="bonus">BONUS</div>
//           </Link>
//           <Navbar />
//         </div>
//       </header>

//       <div className="breadcrumb-container">
//         <Breadcrumb items={breadcrumbItems} />
//       </div>

//       <div className="auth-container">
//         <h2>Вход</h2>
//         <form onSubmit={handleLogin} className="auth-form">
//           {error && <p className="error-message">{error}</p>}
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
//           <button type="submit" className="auth-button" disabled={loading}>
//             {loading ? 'Загрузка...' : 'Войти'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;





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

