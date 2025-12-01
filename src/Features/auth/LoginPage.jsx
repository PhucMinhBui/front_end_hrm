import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import Icons from "../../utils/icons";
import AddUser from "../User/addUser";
import ForgotPassword from "./ForgotPasswordPage";
import "./Login.css";

const LoginPage = ({ onLogin }) => {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await ApiService.login({ email, password });
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onLogin(res.user);
      } else {
        setError(res.message || "Sai thông tin đăng nhập!");
      }
    } catch {
      setError("Đăng nhập thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Nếu user chọn “Quên mật khẩu” thì hiển thị ForgotPassword
  if (showForgot) {
    return <ForgotPassword onBackToLogin={() => setShowForgot(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {!showAddUser ? (
          <>
            <div className="login-header">
              <div className="icon-container">
                {Icons.render("users", "w-8 h-8 text-white")}
              </div>
              <h2 className="login-title">StuTechHR</h2>
              <p className="login-subtitle">Đăng nhập vào hệ thống</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="admin@stutechhr.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />

          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />

          {error && <p className="form-error">{error}</p>}

          <div className="form-extra">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Ghi nhớ đăng nhập
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgot(true);
              }}
              className="forgot-password"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
            </form>
            <div className="form-extra" style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => setShowAddUser(true)}
              className="forgot-password"
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Thêm nhân viên (nhập email)
            </button>
          </div>
          </>
        ) : (
          <AddUser onBackToLogin={() => setShowAddUser(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
