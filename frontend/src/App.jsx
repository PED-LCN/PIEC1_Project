import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import NavigationMobile from "./components/NavigationMobile";
import React, { useState } from "react";
import Login from "./pages/Login";
import Devices from "./pages/Devices";

export default function App() {
  const [possui_login, setPossui_login] = useState(false); //teste, depois o processo será pelo backend
  return (
    <BrowserRouter>
      {!possui_login ? (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={() => setPossui_login(true)} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex">
          <Sidebar />
          <NavigationMobile />
          <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/dispositivos" element={<Devices />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
