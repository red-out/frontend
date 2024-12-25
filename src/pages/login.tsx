import { useState } from "react";
import { Api } from "../api/Api";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/BreadCrumbs";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style.css";

interface LoginResponse {
  status: string;
  session_id?: string;
  id?: number; // Убедитесь, что id действительно возвращается как число.
}

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

      console.log("Полный ответ API:", response);

      const data: LoginResponse = response.data; // Приводим `response.data` к типу LoginResponse.

      if (data?.status === "ok" && data.session_id && data.id !== undefined) {
        console.log("Устанавливаем session_id и id в Redux:", data.session_id, data.id);

        dispatch(login({ id: String(data.id), username: email, sessionId: data.session_id }));
        navigate("/");
      } else {
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      console.error("Ошибка при выполнении запроса:", err);
      setError("Ошибка при аутентификации. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Главная", path: "/" },
    { label: "Список кешбэков", path: "/cashbacks" },
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





