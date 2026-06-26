import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Button from "../components/Button";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recupera os dados dinamicamente do localStorage
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  async function buscarDadosConsumo() {
    if (!usuarioId || !token) return;

    try {
      const response = await fetch(
        `https://web-production-2044e.up.railway.app/api/dispositivos/usuario/${usuarioId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) console.error("Sessão expirada");
        throw new Error("Erro ao buscar dados de consumo");
      }

      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Erro ao atualizar consumo:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarDadosConsumo();

    // Atualiza os dados automaticamente a cada 5 segundos
    const intervalo = setInterval(() => {
      buscarDadosConsumo();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [usuarioId]);

  // Cálculos das métricas globais
  const totalAgua = devices.reduce(
    (acc, dev) => acc + (Number(dev.consumoAgua) || 0),
    0
  );
  const totalEletricidade = devices.reduce(
    (acc, dev) => acc + (Number(dev.consumoEletricidade) || 0),
    0
  );

  // Prepara e ordena os dados para os gráficos (Dispositivos que mais gastam primeiro)
  const dadosAgua = [...devices]
    .map((d) => ({ nome: d.nome, agua: Number(d.consumoAgua || 0) }))
    .sort((a, b) => b.agua - a.agua);

  const dadosEletricidade = [...devices]
    .map((d) => ({
      nome: d.nome,
      eletricidade: Number(d.consumoEletricidade || 0),
    }))
    .sort((a, b) => b.eletricidade - a.eletricidade);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
            Dashboard de Consumo
          </h1>
          <p className="text-sm text-gray-500 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Atualizando em tempo real
          </p>
        </div>

        <Button
          text="Atualizar Agora"
          onClick={buscarDadosConsumo}
          className="w-full md:w-auto px-4 py-3 md:py-2 rounded-xl"
        />
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Consumo Total de Água
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {loading && devices.length === 0
                ? "..."
                : `${totalAgua.toFixed(1)} L`}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Consumo Total de Energia
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {loading && devices.length === 0
                ? "..."
                : `${totalEletricidade.toFixed(1)} kWh`}
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Água */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-800">
            Maiores Consumidores de Água
          </h3>
          <div className="h-64 w-full">
            {dadosAgua.length === 0 ? (
              <p className="text-center text-gray-400 pt-24 text-sm">
                Sem dados disponíveis
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosAgua}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} L`, "Consumo"]}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar dataKey="agua" radius={[8, 8, 0, 0]}>
                    {dadosAgua.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#1D4ED8" : "#3B82F6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de Eletricidade */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-800">
            Maiores Consumidores de Energia
          </h3>
          <div className="h-64 w-full">
            {dadosEletricidade.length === 0 ? (
              <p className="text-center text-gray-400 pt-24 text-sm">
                Sem dados disponíveis
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosEletricidade}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} kWh`, "Consumo"]}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar dataKey="eletricidade" radius={[8, 8, 0, 0]}>
                    {dadosEletricidade.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#B45309" : "#EAB308"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* DETAILED LIST CONTAINER */}
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Consumo Detalhado
        </h2>
        {/* ... (Mantém a tabela/cards de listagem que criamos no passo anterior) ... */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Dispositivo</th>
                <th className="p-4">Consumo de Água</th>
                <th className="p-4">Consumo de Energia</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    {loading
                      ? "Carregando..."
                      : "Nenhum dispositivo encontrado."}
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr
                    key={device.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {device.nome}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        ID: {device.id}
                      </p>
                    </td>
                    <td className="p-4 text-blue-600 font-medium">
                      {Number(device.consumoAgua || 0).toFixed(1)} L
                    </td>
                    <td className="p-4 text-yellow-600 font-medium">
                      {Number(device.consumoEletricidade || 0).toFixed(1)} kWh
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
