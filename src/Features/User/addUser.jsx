import React, { useState } from "react";
import Icons from "../../utils/icons";
import ApiService from "../../service/ApiService";
import "../auth/Login.css";

const AddUser = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("check"); // 'check' or 'profile'

  // profile fields
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("employee");

  const handleCheckEmail = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");
  setLoading(true);

  try {
    const res = await ApiService.checkEmail(email);
    setLoading(false);

    if (res.ok) {
      // ✅ Gọi API thành công & status = 200
      setMessage(res.message || "Email hợp lệ. Vui lòng nhập hồ sơ nhân viên.");
      setStep("profile"); // 👉 Mở sang form nhập thông tin cá nhân

      // Prefill từ backend nếu có
      if (res.data) {
        setEmail(res.data.email || email);
        setFullName(res.data.name || "");
        // các field khác nếu backend có: res.data.employeeId, res.data.role, ...
      }
    } else {
      // ❌ status != 200 hoặc lỗi nghiệp vụ
      setError(res.message || "Email không tồn tại. Vui lòng nhập lại.");
      // nếu muốn, có thể clear email
      // setEmail("");
    }
  } catch (err) {
    setLoading(false);
    setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
  }
};

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = { email, name: fullName, employeeId, role };
      const res = await ApiService.createEmployee(payload);
      setLoading(false);
      if (res && (res.success || res.user)) {
        setMessage("Hồ sơ nhân viên đã được tạo thành công.");
        // reset form ngay lập tức
        setStep("check");
        setEmail("");
        setFullName("");
        setEmployeeId("");
        setRole("employee");
        setTimeout(() => {
          setMessage("");
        }, 300);
      } else {
        setError(res.message || "Không thể tạo hồ sơ, vui lòng thử lại.");
      }
    } catch (err) {
      setLoading(false);
      setError("Đã xảy ra lỗi khi tạo hồ sơ. Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="icon-container">{Icons.render("users", "w-8 h-8 text-white")}</div>
          <h2 className="login-title">StuTechHR</h2>
          <p className="login-subtitle">{step === "check" ? "Kiểm tra email" : "Nhập hồ sơ nhân viên"}</p>
        </div>

        {step === "check" && (
          <form onSubmit={handleCheckEmail} className="login-form">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Nhập email của nhân viên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />

            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Kiểm tra email"}
            </button>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={handleCreateProfile} className="login-form">
            <label className="form-label">Email</label>
            <input type="email" value={email} className="form-input" disabled />

            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              required
            />

            <label className="form-label">Mã nhân viên</label>
            <input
              type="text"
              placeholder="Mã nhân viên"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="form-input"
            />

            <label className="form-label">Vai trò</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">Nhân viên</option>
              <option value="admin">Quản trị</option>
            </select>

            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu hồ sơ"}
              </button>
              <button
                type="button"
                className="forgot-password"
                onClick={() => setStep("check")}
                style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}
              >
                ← Sửa email
              </button>
            </div>
          </form>
        )}

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

export default AddUser;
