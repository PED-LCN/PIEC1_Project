import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tablet,
  Zap,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      path: "/dispositivos",
      label: "Dispositivos",
      icon: <Tablet size={20} />,
    },
    { path: "/consumo", label: "Consumo", icon: <Zap size={20} /> },
    { path: "/notifications", label: "Notificações", icon: <Bell size={20} /> },
    { path: "/relatorios", label: "Relatórios", icon: <FileText size={20} /> },
  ];

  return (
    <aside
      className={`md:block hidden relative ${
        open ? "w-64" : "w-20"
      } min-h-screen bg-gray-950 text-gray-200 p-5 transition-all duration-300 border-r border-emerald-900/30`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-10 -right-3 rounded-full bg-emerald-600 text-white w-6 h-6 flex items-center justify-center shadow-lg hover:bg-emerald-500 transition-colors z-50"
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="mb-10 flex items-center gap-3 overflow-hidden">
        <div className="min-w-[40px] h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.4)]">
          <Zap size={22} className="text-white" fill="currentColor" />
        </div>
        {open && (
          <h1 className="text-xl font-extrabold text-emerald-50 whitespace-nowrap tracking-tight">
            Eco <span className="text-emerald-500">Monitor</span>
          </h1>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]"
                  : "hover:bg-emerald-950/40 text-gray-400 hover:text-emerald-50"
              }`
            }
          >
            <span className={open ? "" : "mx-auto"}>{item.icon}</span>
            {open && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
