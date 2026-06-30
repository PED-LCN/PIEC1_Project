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

  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  async function buscarDadosConsumo() {
    console.log("===== DASHBOARD TESTE =====");
    console.log("usuarioId:", usuarioId);
    console.log("token:", token);

    if (!usuarioId || !token) {
      console.log("Sem login");
      return;
    }

    try {
      const url = `https://piec1-api.onrender.com/api/dispositivos/usuario/${usuarioId}`;

      console.log("Buscando dispositivos:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Status dispositivos:", response.status);

      const listaDispositivos = await response.json();

      console.log("Dispositivos recebidos:", listaDispositivos);

      const dispositivosComConsumo = await Promise.all(
        listaDispositivos.map(async (device) => {
          try {
            const leituraUrl = `https://piec1-api.onrender.com/api/leituras/dispositivo/${device.id}`;

            console.log("Buscando leituras:", leituraUrl);

            const leituraResponse = await fetch(leituraUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("Status leitura:", device.id, leituraResponse.status);

            const leituras = await leituraResponse.json();

            console.log("Leituras recebidas:", device.id, leituras);

            const consumo = leituras.reduce(
              (total, item) => total + Number(item.valorLeitura || 0),
              0
            );

            console.log("Consumo calculado:", device.nome, consumo);

            return {
              ...device,
              valorConsumo: consumo,
            };
          } catch (error) {
            console.error("Erro leitura:", error);

            return {
              ...device,
              valorConsumo: 0,
            };
          }
        })
      );

      console.log("RESULTADO FINAL:", dispositivosComConsumo);

      setDevices(dispositivosComConsumo);
    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarDadosConsumo();

    const intervalo = setInterval(buscarDadosConsumo, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const totalAgua = devices
    .filter(
      (d) =>
        d.tipoLeitura?.toLowerCase() === "água" ||
        d.tipoLeitura?.toLowerCase() === "agua"
    )
    .reduce((acc, d) => acc + Number(d.valorConsumo || 0), 0);

  const totalEletricidade = devices
    .filter(
      (d) =>
        d.tipoLeitura?.toLowerCase() === "energia" ||
        d.tipoLeitura?.toLowerCase() === "eletricidade"
    )
    .reduce((acc, d) => acc + Number(d.valorConsumo || 0), 0);

  const dadosAgua = devices
    .filter(
      (d) =>
        d.tipoLeitura?.toLowerCase() === "água" ||
        d.tipoLeitura?.toLowerCase() === "agua"
    )
    .map((d) => ({
      nome: d.nome,
      agua: d.valorConsumo,
    }));

  const dadosEletricidade = devices
    .filter(
      (d) =>
        d.tipoLeitura?.toLowerCase() === "energia" ||
        d.tipoLeitura?.toLowerCase() === "eletricidade"
    )
    .map((d) => ({
      nome: d.nome,
      eletricidade: d.valorConsumo,
    }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Dashboard de Consumo
          </h1>

          <p className="text-sm text-gray-500">Atualizando em tempo real</p>
        </div>

        <Button
          text="Atualizar Agora"
          onClick={buscarDadosConsumo}
          className="w-full md:w-auto px-4 py-3 md:py-2 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-400">Consumo Total de Água</p>

          <p className="text-3xl font-bold">
            {loading ? "..." : `${totalAgua} L`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-400">Consumo Total Energia</p>

          <p className="text-3xl font-bold">
            {loading ? "..." : `${totalEletricidade} kWh`}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md h-80">
          <h3 className="font-bold mb-3">Água</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosAgua}>
              <XAxis dataKey="nome" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="agua">
                {dadosAgua.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md h-80">
          <h3 className="font-bold mb-3">Energia</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosEletricidade}>
              <XAxis dataKey="nome" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="eletricidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-bold mb-4">Dispositivos Cadastrados</h2>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nome</th>

              <th className="p-3 text-left">Tipo</th>

              <th className="p-3 text-left">Consumo</th>
            </tr>
          </thead>

          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center">
                  Nenhum dispositivo encontrado
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id} className="border-t">
                  <td className="p-3">{device.nome}</td>

                  <td className="p-3">{device.tipoLeitura}</td>

                  <td className="p-3">{device.valorConsumo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
