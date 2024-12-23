import { useState } from "react";
import { Api } from "../api/Api";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/BreadCrumbs";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const api = new Api();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.login.loginCreate(
        { email, password },
        { withCredentials: true }
      );

      console.log("Полный ответ API:", response); // Логируем полный ответ API
      console.log("response.data:", response.data); // Логируем data из ответа

      if (response.data?.status === "ok") {
        const { session_id, id } = response.data; // Получаем session_id и id из ответа

        console.log("Устанавливаем session_id и id в Redux:", session_id, id); // Логируем session_id и id

        dispatch(login({ id, username: email, sessionId: session_id }));
        navigate("/");
      } else {
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      console.error("Ошибка при выполнении запроса:", err); // Логируем ошибку
      setError("Ошибка при аутентификации. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Главная", path: "/" },
    { label: 'Список кешбэков', path: '/cashbacks' },
    { label: "Вход", path: "/login" },
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
        <form onSubmit={handleSubmit} className="auth-form">
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
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import { Api } from "../api/Api";
// import { useDispatch } from "react-redux";
// import { login } from "../slices/authSlice";
// import Navbar from "../components/Navbar";
// import Breadcrumb from "../components/BreadCrumbs";
// import { Link, useNavigate } from "react-router-dom";
// import "../assets/style.css";

// const Login = () => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const dispatch = useDispatch();
//   const api = new Api();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.login.loginCreate(
//         { email, password },
//         { withCredentials: true }
//       );

//       console.log("Полный ответ API:", response); // Логируем полный ответ API
//       console.log("response.data:", response.data); // Логируем data из ответа

//       if (response.data?.status === "ok") {
//         const sessionId = response.data.session_id; // Получаем session_id из ответа

//         console.log("Устанавливаем session_id в Redux:", sessionId); // Логируем session_id

//         dispatch(login({ username: email, sessionId }));
//         navigate("/");
//       } else {
//         setError("Не удалось войти. Проверьте данные и попробуйте снова.");
//       }
//     } catch (err) {
//       console.error("Ошибка при выполнении запроса:", err); // Логируем ошибку
//       setError("Ошибка при аутентификации. Попробуйте позже.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const breadcrumbItems = [
//     { label: "Главная", path: "/" },
//     { label: "Вход", path: "/login" },
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
//         <form onSubmit={handleSubmit} className="auth-form">
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
//           <button type="submit" disabled={loading} className="auth-button">
//             {loading ? "Загрузка..." : "Войти"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;













// import { useState } from "react";
// import { Api } from "../api/Api"; // Импортируем API
// import Navbar from "../components/Navbar"; // Импортируем Navbar
// import Breadcrumb from "../components/BreadCrumbs"; // Импортируем Breadcrumb
// import { Link, useNavigate } from "react-router-dom"; // Для навигации
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
//       // Отправляем запрос на сервер
//       const response = await api.login.loginCreate(
//         { email, password },
//         { withCredentials: true } // Передача куки с запросом
//       );

//       // Проверяем успешность ответа
//       if (response.data?.status === "ok") {
//         navigate("/"); // Перенаправляем на главную страницу
//       } else {
//         setError("Не удалось войти. Проверьте данные и попробуйте снова.");
//       }
//     } catch (err) {
//       setError("Ошибка при аутентификации. Попробуйте позже.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const breadcrumbItems = [
//     { label: "Главная", path: "/" },
//     { label: "Вход", path: "/login" },
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
//         <form onSubmit={handleSubmit} className="auth-form">
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

//           <button type="submit" disabled={loading} className="auth-button">
//             {loading ? "Загрузка..." : "Войти"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



