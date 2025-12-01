import React, { useState } from "react";
import Icons from "../../utils/icons";
import "./Login.css";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Giả lập gọi API — bạn có thể thay bằng ApiService.forgotPassword(email)
      setTimeout(() => {
        setLoading(false);
        if (email.includes("@")) {
          setMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
        } else {
          setError("Email không hợp lệ. Vui lòng kiểm tra lại.");
        }
      }, 1500);
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau!");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="icon-container">
            {Icons.render("users", "w-8 h-8 text-white")}
          </div>
          <h2 className="login-title">StuTechHR</h2>
          <p className="login-subtitle">Quên mật khẩu</p>
        </div>

        <form onSubmit={handleForgotPassword} className="login-form">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>

        <div className="form-extra" style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            onClick={onBackToLogin}
            className="forgot-password"
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
