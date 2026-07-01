import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Button from "../components/Button";

const API = "https://piec1-api.onrender.com/api";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscando = useRef(false);

  async function buscarDadosConsumo() {
    if (buscando.current) return;

    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("token");

    if (!usuarioId || !token) {
      setLoading(false);
      return;
    }

    try {
      buscando.current = true;
      setLoading(true);

      const response = await fetch(`${API}/dispositivos/meus-dispositivos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const lista = await response.json();

      if (!response.ok) throw new Error("Erro ao buscar dispositivos");

      const listaDispositivos = Array.isArray(lista) ? lista : [];

      const dispositivosComConsumo = await Promise.all(
        listaDispositivos.map(async (device) => {
          try {
            const leituraResponse = await fetch(
              `${API}/leituras/dispositivo/${device.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const resultado = await leituraResponse.json();

            const leituras = Array.isArray(resultado?.content)
              ? resultado.content
              : [];

            const consumo = leituras.reduce(
              (total, item) => total + Number(item.valorLeitura || 0),
              0
            );

            return {
              ...device,
              valorConsumo: consumo,
            };
          } catch {
            return {
              ...device,
              valorConsumo: 0,
            };
          }
        })
      );

      setDevices(dispositivosComConsumo);
    } catch (error) {
      console.error(error);
      setDevices([]);
    } finally {
      setLoading(false);
      buscando.current = false;
    }
  }

  useEffect(() => {
    buscarDadosConsumo();
    const intervalo = setInterval(buscarDadosConsumo, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const totalAgua = devices
    .filter((d) => ["água", "agua"].includes(d.tipoLeitura?.toLowerCase()))
    .reduce((acc, d) => acc + Number(d.valorConsumo || 0), 0);

  const totalEnergia = devices
    .filter((d) =>
      ["energia", "eletricidade"].includes(d.tipoLeitura?.toLowerCase())
    )
    .reduce((acc, d) => acc + Number(d.valorConsumo || 0), 0);

  const dadosAgua = devices
    .filter((d) => ["água", "agua"].includes(d.tipoLeitura?.toLowerCase()))
    .map((d) => ({
      nome: d.nome,
      agua: d.valorConsumo,
    }));

  const dadosEnergia = devices
    .filter((d) =>
      ["energia", "eletricidade"].includes(d.tipoLeitura?.toLowerCase())
    )
    .map((d) => ({
      nome: d.nome,
      energia: d.valorConsumo,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-3 border text-sm">
          <p className="font-bold">{label}</p>
          <p>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Consumo</h1>
          <p className="text-sm text-gray-500">Atualizando em tempo real</p>
        </div>

        <Button text="Atualizar Agora" onClick={buscarDadosConsumo} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
          <p>Consumo Total Água</p>
          <strong className="text-3xl">
            {loading ? "..." : `${totalAgua} L`}
          </strong>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <p>Consumo Total Energia</p>
          <strong className="text-3xl">
            {loading ? "..." : `${totalEnergia} kWh`}
          </strong>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Água */}
        <div className="bg-white p-6 rounded-2xl shadow h-80">
          <h3 className="font-bold mb-3 text-blue-600">Água</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosAgua}>
              <defs>
                <linearGradient id="aguaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="agua"
                fill="url(#aguaColor)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Energia */}
        <div className="bg-white p-6 rounded-2xl shadow h-80">
          <h3 className="font-bold mb-3 text-orange-600">Energia</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosEnergia}>
              <defs>
                <linearGradient id="energiaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#fdba74" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="energia"
                fill="url(#energiaColor)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-bold mb-4">Dispositivos Cadastrados</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Consumo</th>
            </tr>
          </thead>

          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{device.nome}</td>
                <td className="p-3">{device.tipoLeitura}</td>
                <td className="p-3 font-medium">{device.valorConsumo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
