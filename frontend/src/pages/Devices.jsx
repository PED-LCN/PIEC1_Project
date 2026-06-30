import { useState, useEffect } from "react";
import Form from "../components/Form";
import Button from "../components/Button";

export default function Devices() {
  const [showForm, setShowForm] = useState(false);
  const [devices, setDevices] = useState([]);

  async function buscarDispositivos() {
    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("token");

    console.log("===== TESTE LOGIN =====");
    console.log("usuarioId:", usuarioId);
    console.log("token:", token);
    console.log("=======================");

    if (!usuarioId || !token) {
      console.log("Não possui token ou usuarioId");
      return;
    }

    try {
      const url = `https://piec1-api.onrender.com/api/dispositivos/usuario/${usuarioId}`;

      console.log("URL chamada:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Status da API:", response.status);

      const data = await response.json();

      console.log("Resposta API:", data);

      if (!response.ok) {
        throw new Error("Erro ao buscar dispositivos");
      }

      setDevices(data);
    } catch (error) {
      console.error("ERRO:", error);
    }
  }

  useEffect(() => {
    buscarDispositivos();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dispositivos
        </h1>

        <Button
          text={showForm ? "Fechar" : "+ Adicionar"}
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto px-4 py-3 md:py-2 rounded-xl"
        />
      </div>

      {showForm && (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
          <Form
            onClose={() => setShowForm(false)}
            onSuccess={buscarDispositivos}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  Nenhum dispositivo cadastrado
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id} className="border-t">
                  <td className="p-4">{device.id}</td>

                  <td className="p-4">{device.nome}</td>

                  <td className="p-4">
                    <button className="text-red-600">Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
