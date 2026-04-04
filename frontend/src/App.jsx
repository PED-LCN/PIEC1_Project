import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";

// páginas
//import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
//import Consumo from "./pages/Consumo";
//import Relatorios from "./pages/Relatorios";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
