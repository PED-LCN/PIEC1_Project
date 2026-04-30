import { NavLink } from "react-router-dom";
import { LineChart, Cpu, BarChart3, Bell, FileText } from "lucide-react";

export default function BottomMenu() {
  const items = [
    { id: "dashboard", icon: LineChart, path: "/", label: "Dashboard" },
    {
      id: "dispositivos",
      icon: Cpu,
      path: "/dispositivos",
      label: "Dispositivos",
    },
    { id: "consumo", icon: BarChart3, path: "/consumo", label: "Consumo" },
    {
      id: "notifications",
      icon: Bell,
      path: "/notifications",
      label: "Alertas",
    },
    {
      id: "relatorios",
      icon: FileText,
      path: "/relatorios",
      label: "Relatórios",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around items-center py-2 z-50">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-all ${
                isActive ? "text-purple-700" : "text-gray-600"
              }`
            }
          >
            <Icon size={22} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
