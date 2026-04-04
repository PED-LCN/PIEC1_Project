import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import React, { useState } from "react";
import Login from "./pages/Login";
// páginas
//import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
//import Consumo from "./pages/Consumo";
//import Relatorios from "./pages/Relatorios";

export default function App() {
  const [possui_login, setPossui_login] = useState(false);
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
          <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
