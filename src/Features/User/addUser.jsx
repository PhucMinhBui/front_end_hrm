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

  // --------- BASIC PROFILE ---------
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("male"); // male/female -> true/false khi gửi API
  const [nation, setNation] = useState("Vietnam");
  const [ethnic, setEthnic] = useState("");
  const [phone, setPhone] = useState("");

  // Địa chỉ
  const [permanent, setPermanent] = useState("");
  const [tempAddress, setTempAddress] = useState("");

  // Giấy tờ
  const [identification, setIdentification] = useState("");
  const [issuePlace, setIssuePlace] = useState("");
  const [issueDate, setIssueDate] = useState("");

  // Khác
  const [habit, setHabit] = useState("");
  const [statusMarital, setStatusMarital] = useState("");

  // --------- RELATIVES (NGƯỜI THÂN) ---------
  const [relatives, setRelatives] = useState([]);
  const handleAddRelative = () => {
    setRelatives((prev) => [
      ...prev,
      { name: "", relation: "", dateOfBirth: "", gender: "male", phone: "" },
    ]);
  };
  const handleRelativeChange = (index, field, value) => {
    setRelatives((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };
  const handleRemoveRelative = (index) => {
    setRelatives((prev) => prev.filter((_, i) => i !== index));
  };

  // --------- BANK ---------
  const [bankName, setBankName] = useState("");
  const [bankAgent, setBankAgent] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankRout, setBankRout] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankProvince, setBankProvince] = useState("");

  // ================== CHECK EMAIL ==================
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await ApiService.checkEmail(email);
      setLoading(false);

      if (res.ok) {
        setMessage(res.message || "Email hợp lệ. Vui lòng nhập hồ sơ nhân viên.");
        setStep("profile");

        if (res.data) {
          setEmail(res.data.email || email);
          setFullName(res.data.name || "");
        }
      } else {
        setError(res.message || "Email không tồn tại. Vui lòng nhập lại.");
      }
    } catch (err) {
      setLoading(false);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  // ================== CREATE PROFILE ==================
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Build payload đúng theo RequestBody backend cần
    const payload = {
      emailRecruit: email,          // tạm thời dùng chính email này
      name: fullName,
      email: email,
      birthDate,                   // "2003-10-10"
      gender: gender === "male",   // true/false
      nation,
      ethnic,
      phone,
      permanent,
      tempAddress,
      identification,
      issuePlace,
      issueDate,                   // "2021-04-21"
      habit,
      statusMarital,
      relatives: relatives.map((r) => ({
        name: r.name,
        relation: r.relation,
        dateOfBirth: r.dateOfBirth,
        gender: r.gender === "male",
        phone: r.phone,
      })),
      bank: {
        nameBank: bankName,
        agent: bankAgent,
        numberAccountBank: bankAccountNumber,
        numberRout: bankRout,
        nameAccountBank: bankAccountName,
        province: bankProvince,
      },
    };

    try {
      const res = await ApiService.createEmployee(payload);
      setLoading(false);

      // TODO: chỉnh điều kiện theo đúng response API createEmployee của bạn
      if (res && (res.success || res.status === 200)) {
        setMessage("Hồ sơ nhân viên đã được gửi thành công.");

        // reset form
        setStep("check");
        setFullName("");
        setBirthDate("");
        setGender("male");
        setNation("Vietnam");
        setEthnic("");
        setPhone("");
        setPermanent("");
        setTempAddress("");
        setIdentification("");
        setIssuePlace("");
        setIssueDate("");
        setHabit("");
        setStatusMarital("");
        setRelatives([]);
        setBankName("");
        setBankAgent("");
        setBankAccountNumber("");
        setBankRout("");
        setBankAccountName("");
        setBankProvince("");
        // email giữ lại để user khỏi gõ lại, hoặc:
        // setEmail("");
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
      <div className={`login-box ${step === "profile" ? "login-box--wide" : ""}`}>
        <div className="login-header">
          <div className="icon-container">
            {Icons.render("users", "w-8 h-8 text-white")}
          </div>
          <h2 className="login-title">StuTechHR</h2>
          <p className="login-subtitle">
            {step === "check" ? "Kiểm tra email" : "Nhập hồ sơ nhân viên"}
          </p>
        </div>

        {/* BƯỚC 1: CHECK EMAIL */}
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

        {/* BƯỚC 2: NHẬP HỒ SƠ */}
        {step === "profile" && (
          <form onSubmit={handleCreateProfile} className="login-form">
            {/* Thông tin cơ bản */}
            <h3 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              I. Thông tin cơ bản
            </h3>

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

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Giới tính</label>
                <select
                  className="form-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}required
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
                
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Quốc tịch</label>
                <input
                  type="text"
                  value={nation}
                  onChange={(e) => setNation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Dân tộc</label>
                <input
                  type="text"
                  value={ethnic}
                  onChange={(e) => setEthnic(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
            />

            {/* Địa chỉ */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
              II. Địa chỉ
            </h3>

            <label className="form-label">Địa chỉ thường trú</label>
            <input
              type="text"
              value={permanent}
              onChange={(e) => setPermanent(e.target.value)}
              className="form-input"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              required
            />

            <label className="form-label">Địa chỉ tạm trú</label>
            <input
              type="text"
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              className="form-input"
              placeholder="Nếu giống thường trú có thể copy lại"
              required
            />

            {/* Giấy tờ */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
              III. Giấy tờ tùy thân
            </h3>

            <label className="form-label">Số CMND/CCCD</label>
            <input
              type="text"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              className="form-input"
              required
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Nơi cấp</label>
                <input
                  type="text"
                  value={issuePlace}
                  onChange={(e) => setIssuePlace(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Ngày cấp</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Khác */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
              IV. Thông tin khác
            </h3>

            <label className="form-label">Sở thích / Thói quen</label>
            <input
              type="text"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              className="form-input"
              placeholder="Ví dụ: Âm nhạc, Du lịch..."
              required
            />

            <label className="form-label">Tình trạng hôn nhân</label>
            <input
              type="text"
              value={statusMarital}
              onChange={(e) => setStatusMarital(e.target.value)}
              className="form-input"
              placeholder="Độc thân / Đã kết hôn / Khác"
              required
            />

            {/* Người thân */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
              V. Thông tin người thân
            </h3>

            {relatives.map((rel, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                  }}
                >
                  <strong>Người thân #{index + 1}</strong>
                  <button
                    type="button"
                    onClick={() => handleRemoveRelative(index)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>

                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  value={rel.name}
                  onChange={(e) =>
                    handleRelativeChange(index, "name", e.target.value)
                  }
                  className="form-input"
                  required
                />

                <label className="form-label">Quan hệ</label>
                <input
                  type="text"
                  value={rel.relation}
                  onChange={(e) =>
                    handleRelativeChange(index, "relation", e.target.value)
                  }
                  className="form-input"
                  placeholder="Cha, Mẹ, Vợ/Chồng, Anh/Chị/Em..."
                  required
                />

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      value={rel.dateOfBirth}
                      onChange={(e) =>
                        handleRelativeChange(
                          index,
                          "dateOfBirth",
                          e.target.value
                        )
                      }
                      className="form-input"
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Giới tính</label>
                    <select
                      className="form-input"
                      value={rel.gender}
                      onChange={(e) =>
                        handleRelativeChange(index, "gender", e.target.value)
                      }
                      required
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                </div>

                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  value={rel.phone}
                  onChange={(e) =>
                    handleRelativeChange(index, "phone", e.target.value)
                  }
                  className="form-input"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddRelative}
              className="login-btn"
              style={{ backgroundColor: "#e5e7eb", color: "#111827", marginTop: "0.25rem" }}
            >
              + Thêm người thân
            </button>

            {/* Ngân hàng */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
              VI. Thông tin ngân hàng
            </h3>

            <label className="form-label">Tên ngân hàng</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="form-input"
              placeholder="VD: VIETINBANK - CN Thủ Đức..."
              required
            />

            <label className="form-label">Chi nhánh</label>
            <input
              type="text"
              value={bankAgent}
              onChange={(e) => setBankAgent(e.target.value)}
              className="form-input"
              required
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Số tài khoản</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Mã routing / swift</label>
                <input
                  type="text"
                  value={bankRout}
                  onChange={(e) => setBankRout(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <label className="form-label">Tên chủ tài khoản</label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              className="form-input"
              required
            />

            <label className="form-label">Tỉnh / Thành phố mở tài khoản</label>
            <input
              type="text"
              value={bankProvince}
              onChange={(e) => setBankProvince(e.target.value)}
              className="form-input"
              required
            />

            {/* Error / Success */}
            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang lưu..." : "Gửi hồ sơ"}
              </button>
              <button
                type="button"
                className="forgot-password"
                onClick={() => setStep("check")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                }}
              >
                ← Sửa email
              </button>
            </div>
          </form>
        )}

        <div
          className="form-extra"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
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
