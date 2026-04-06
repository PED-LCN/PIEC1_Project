import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/dispositivos", label: "Dispositivos" },
    { path: "/consumo", label: "Consumo" },
    { path: "/relatorios", label: "Relatórios" },
  ];

  return (
    <aside
      className={`absolute ${
        open ? "w-64 z-10" : "w-20"
      } min-h-screen bg-gray-900 text-white p-5 transition-all duration-300 `}
    >
      {/* Botão toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-6 -right-6 rounded-r-lg bg-purple-600 text-white w-6 h-12 flex items-center justify-center shadow-md hover:bg-purple-700 transition"
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Título */}
      {open && <h1 className="text-xl font-bold mb-6">Meu App</h1>}

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive ? "bg-purple-600" : "hover:bg-gray-700"
              }`
            }
          >
            {open ? item.label : item.label[0]}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
