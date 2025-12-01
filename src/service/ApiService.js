// src/service/ApiService.js

const ApiService = {
  baseURL: " http://192.168.1.8:8080",
  

  // ---------------- AUTH ----------------
  async login(credentials) {
    // 1️⃣ Ưu tiên trả demo trước
    if (
      credentials.email === "admin@stutechhr.com" &&
      credentials.password === "admin123"
    ) {
      return {
        success: true,
        token: "demo-token",
        user: { name: "Admin", role: "admin", id: 1 },
        isDemo: true
      };
    }

    if (
      credentials.email === "employee@stutechhr.com" &&
      credentials.password === "emp123"
    ) {
      return {
        success: true,
        token: "demo-token-emp",
        user: {
          name: "Nguyễn Văn A",
          role: "employee",
          id: 2,
          employeeId: "EMP001"
        },
        isDemo: true
      };
    }

    // 2️⃣ Gọi API thật → không chặn UI
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      return await response.json();
    } catch {
      return {
        success: false,
        message: "Không thể kết nối tới server"
      };
    }
  },

  // ---------------- EMAIL ----------------
   async checkEmail(email) {
    if (email === "demo@stutechhr.com") {
    const demoPayload = {
      status: 200,
      msg: "Recruitment (demo)",
      data: {
        id: 999,
        email,
        name: "Demo User",
        date: "2025-12-01",
        status: true,
        idFunction: 3,
      },
    };

    return {
      ok: true,
      message: demoPayload.msg,
      data: demoPayload.data,
    };
  }



    try {
      const res = await fetch(`${this.baseURL}/confirmations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }), // email=...
      });

      const payload = await res.json(); // { status, msg, data }
      console.log("Payload API:", payload);
      const ok = res.ok && payload.status === 200;

      return {
        ok,
        message: payload.msg || "",
        data: ok ? payload.data : null, // { id, email, name, ... }
      };
    } catch (e) {
      return {
        ok: false,
        message: "Server không phản hồi",
        data: null,
      };
    }
  },

  // ---------------- CREATE EMPLOYEE ----------------
  async createEmployee(payload) {
    // 1️⃣ Demo trả về ngay
    const demoResult = {
      success: true,
      user: { ...payload, id: Date.now() },
      message: "Tạo nhân viên demo thành công",
      isDemo: true
    };

    // UI nhận demo ngay
    setTimeout(() => {}, 0);

    // 2️⃣ Gọi API thật (không block UI)
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const realData = await response.json();

      return { ...realData, isDemo: false };
    } catch {
      return demoResult;
    }
  },

  // ---------------- DASHBOARD ----------------
  async getDashboardStats() {
    // 1️⃣ Luôn trả DEMO thật nhanh → UI hiển thị ngay không delay
    const demo = {
      totalEmployees: 156,
      todayAttendance: 142,
      lateToday: 8,
      monthlySalary: "2.8B",
      weeklyAttendance: [
        { day: "Thứ 2", present: 148, total: 156 },
        { day: "Thứ 3", present: 144, total: 156 },
        { day: "Thứ 4", present: 139, total: 156 },
        { day: "Thứ 5", present: 142, total: 156 },
        { day: "Thứ 6", present: 142, total: 156 }
      ],
      notifications: [
        {
          type: "warning",
          title: "Cảnh báo vị trí",
          message: "Nguyễn Văn A chấm công ngoài phạm vi",
          time: "5 phút trước"
        },
        {
          type: "info",
          title: "Đơn nghỉ phép",
          message: "Trần Thị B gửi đơn nghỉ 3 ngày",
          time: "1 giờ trước"
        },
        {
          type: "success",
          title: "Nhân viên mới",
          message: "Lê Văn C đã thêm vào hệ thống",
          time: "2 giờ trước"
        }
      ],
      isDemo: true
    };

    // UI nhận dữ liệu demo NGAY LẬP TỨC
    return demo;

    // 2️⃣ Đồng thời gọi API thật phía sau
    setTimeout(async () => {
      try {
        const response = await fetch(`${this.baseURL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await response.json();

        // Bạn có thể lưu lại realData vào state hoặc global store nếu cần
        console.log("Dữ liệu API thật:", data);
      } catch (error) {
        console.log("API dashboard lỗi, giữ nguyên demo");
      }
    }, 0);
  },

  // ---------------- ATTENDANCE ----------------
  async checkIn(payload) {
    // Demo trả ngay
    const demo = {
      success: true,
      message: "Check-in thành công! (demo)",
      time: new Date().toLocaleTimeString("vi-VN"),
      isDemo: true
    };

    return demo;

    // API thật phía sau
    try {
      const res = await fetch(`${this.baseURL}/attendance/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch {
      return demo;
    }
  },

  async checkOut(payload) {
    // Demo trước
    const demo = {
      success: true,
      message: "Check-out thành công! (demo)",
      time: new Date().toLocaleTimeString("vi-VN"),
      isDemo: true
    };

    return demo;

    // API thật
    try {
      const res = await fetch(`${this.baseURL}/attendance/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch {
      return demo;
    }
  }
};

export default ApiService;
