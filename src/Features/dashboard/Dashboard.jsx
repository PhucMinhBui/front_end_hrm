// src/Features/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../../Layout/Hearder";
import Sidebar from "../../Layout/Sidebar";
import ApiService from "../../service/ApiService";

/* -------------------------------------------------------
   DEMO DATA: dùng để hiển thị ngay lập tức
   ------------------------------------------------------- */
const DEMO_DASHBOARD_STATS = {
  totalEmployees: 156,
  todayAttendance: 142,
  lateToday: 8,
  monthlySalary: "2.8B",
  weeklyAttendance: [
    { day: "Thứ 2", present: 148, total: 156 },
    { day: "Thứ 3", present: 144, total: 156 },
    { day: "Thứ 4", present: 139, total: 156 },
    { day: "Thứ 5", present: 142, total: 156 },
    { day: "Thứ 6", present: 142, total: 156 },
  ],
  notifications: [
    {
      type: "warning",
      title: "Cảnh báo vị trí",
      message: "Nguyễn Văn A chấm công ngoài phạm vi cho phép",
      time: "5 phút trước",
    },
    {
      type: "info",
      title: "Đơn nghỉ phép",
      message: "Trần Thị B gửi đơn nghỉ phép 3 ngày",
      time: "1 giờ trước",
    },
    {
      type: "success",
      title: "Nhân viên mới",
      message: "Lê Văn C đã được thêm vào hệ thống",
      time: "2 giờ trước",
    },
  ],
};

/* =======================================================
   DASHBOARD NỘI DUNG CHÍNH
   ======================================================= */

const DashboardContent = () => {
  // 1️⃣ Dùng DEMO làm state khởi tạo → hiển thị ngay lập tức
  const [stats, setStats] = useState(DEMO_DASHBOARD_STATS);
  const [loadingReal, setLoadingReal] = useState(false);
  const [error, setError] = useState("");

  // 2️⃣ Sau khi render lần đầu → gọi API thật, nếu có dữ liệu thì ghi đè
  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        setLoadingReal(true);
        const data = await ApiService.getDashboardStats(); // có thể trả demo hoặc real
        if (data) {
          // Gộp để nếu API thiếu field vẫn còn demo
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
        setError("Không thể cập nhật dữ liệu thực từ server.");
      } finally {
        setLoadingReal(false);
      }
    };

    fetchRealStats();
  }, []);

  const {
    totalEmployees,
    todayAttendance,
    lateToday,
    monthlySalary,
    weeklyAttendance,
    notifications,
  } = stats;

  return (
    <div className="space-y-6">
      {/* Hàng trên: 4 card thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Tổng nhân viên"
          value={totalEmployees ?? 0}
          sub=" +12% so với tháng trước"
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5V4H2v16h5m10 0V10m0 10l-3-3m3 3l3-3M9 9h.01M7 12h4m-4 3h4"
              />
            </svg>
          }
          iconBg="bg-blue-100"
        />
        <StatCard
          label="Chấm công hôm nay"
          value={todayAttendance ?? 0}
          sub="91% đã chấm công"
          icon={
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          iconBg="bg-emerald-100"
        />
        <StatCard
          label="Đi trễ hôm nay"
          value={lateToday ?? 0}
          sub="5.6% tổng số nhân viên"
          icon={
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 22a10 10 0 100-20 10 10 0 000 20z"
              />
            </svg>
          }
          iconBg="bg-red-100"
        />
        <StatCard
          label="Lương tháng này"
          value={monthlySalary ?? "0"}
          sub="VND"
          icon={
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-15v2m0 11v2"
              />
            </svg>
          }
          iconBg="bg-yellow-100"
        />
      </div>

      {/* Nếu có lỗi server thực thì hiển thị nhỏ ở góc */}
      {error && (
        <div className="text-xs text-red-500">
          {error} (đang hiển thị dữ liệu demo)
        </div>
      )}
      {!error && loadingReal && (
        <div className="text-xs text-slate-400">
          Đang đồng bộ dữ liệu thực từ server...
        </div>
      )}

      {/* Hàng dưới: Thống kê tuần + Thông báo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thống kê chấm công tuần */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold mb-6">
            Thống kê chấm công tuần
          </h3>

          <div className="space-y-4">
            {weeklyAttendance &&
              weeklyAttendance.map((item, idx) => {
                const percent =
                  item.total && item.total > 0
                    ? Math.round((item.present / item.total) * 100)
                    : 0;

                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-slate-600">
                      {item.day}
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm text-slate-700">
                      {item.present}/{item.total}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Thông báo mới nhất */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold mb-6">
            Thông báo mới nhất
          </h3>

          <div className="space-y-4">
            {notifications &&
              notifications.map((n, idx) => (
                <NotificationCard key={idx} notification={n} />
              ))}

            {(!notifications || notifications.length === 0) && (
              <div className="text-sm text-slate-500">
                Hiện chưa có thông báo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================================================
   CÁC COMPONENT PHỤ: StatCard + NotificationCard
   ======================================================= */

const StatCard = ({ label, value, sub, icon, iconBg }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-5 py-4 flex justify-between items-start">
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
    <div
      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg}`}
    >
      {icon}
    </div>
  </div>
);

const NotificationCard = ({ notification }) => {
  const { type, title, message, time } = notification;

  let dotColor = "bg-slate-400";
  let bgColor = "bg-slate-50";

  if (type === "warning") {
    dotColor = "bg-red-500";
    bgColor = "bg-red-50";
  } else if (type === "info") {
    dotColor = "bg-yellow-400";
    bgColor = "bg-yellow-50";
  } else if (type === "success") {
    dotColor = "bg-blue-500";
    bgColor = "bg-blue-50";
  }

  return (
    <div className={`rounded-2xl px-4 py-3 flex gap-3 ${bgColor}`}>
      <div className="pt-1">
        <span className={`w-2.5 h-2.5 rounded-full inline-block ${dotColor}`} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-600 mt-0.5">{message}</div>
        <div className="text-[11px] text-slate-400 mt-1">{time}</div>
      </div>
    </div>
  );
};

/* =======================================================
   LAYOUT CHUNG: Header + Sidebar + DashboardContent
   ======================================================= */

const DashboardLayout = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />;
      case "employees":
        return <p>👨‍💼 Trang quản lý nhân viên</p>;
      case "departments":
        return <p>🏢 Danh sách phòng ban</p>;
      case "attendance":
        return <p>🕒 Trang chấm công nhân viên</p>;
      case "attendance-admin":
        return <p>📅 Quản lý chấm công tổng thể</p>;
      case "payroll":
        return <p>💰 Trang bảng lương</p>;
      case "leave":
        return <p>📝 Đơn nghỉ phép nhân viên</p>;
      case "settings":
        return <p>⚙️ Cài đặt hệ thống</p>;
      default:
        return <p>Chọn một mục từ thanh bên trái</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={user?.role}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-col flex-1 lg:ml-64">
        <Header
          currentPage={currentPage}
          user={user}
          onLogout={onLogout}
          toggleSidebar={toggleSidebar}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="bg-slate-50">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
