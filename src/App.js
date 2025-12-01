import React, { useState } from "react";
import LoginPage from "./Features/auth/LoginPage";
import DashboardLayout from "./Features/dashboard/Dashboard";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardLayout user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
