import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import NavigationMobile from "./components/NavigationMobile";
import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Devices from "./pages/Devices";

export default function App() {
  const [possui_login, setPossui_login] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    setPossui_login(false);
  };

  return (
    <BrowserRouter>
      {!possui_login ? (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={() => setPossui_login(true)} />}
          />
          <Route
            path="/register"
            element={
              <Register
                onNavigateToLogin={() => (window.location.href = "/login")}
              />
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex flex-col md:flex-row">
          <Sidebar onLogout={handleLogout} />
          <NavigationMobile />

          <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/dispositivos" />} />

              <Route path="/dispositivos" element={<Devices />} />

              <Route path="/login" element={<Navigate to="/dispositivos" />} />

              <Route
                path="*"
                element={<h1 className="p-4">Página não encontrada</h1>}
              />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
