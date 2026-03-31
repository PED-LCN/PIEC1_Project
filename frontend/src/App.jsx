import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/SideBar";
import Products from "./pages/Products";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <div className="flex">
              <Sidebar />

              <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />

                  <Route path="/products" element={<Products />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
