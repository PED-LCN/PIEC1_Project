import { useState, useEffect } from "react";
import Form from "../components/Form";
import Button from "../components/Button";

export default function Devices() {
  const [showForm, setShowForm] = useState(false);
  const [devices, setDevices] = useState([]);

  // Recupera os dados dinamicamente do localStorage
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  async function buscarDispositivos() {
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
        throw new Error("Erro ao buscar dispositivos");
      }

      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    buscarDispositivos();
  }, [usuarioId]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
          Dispositivos
        </h1>

        <Button
          text={showForm ? "Fechar" : "+ Adicionar"}
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto px-4 py-3 md:py-2 rounded-xl"
        />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
          <Form
            onClose={() => setShowForm(false)}
            onSuccess={buscarDispositivos}
          />
        </div>
      )}

      {/* CONTAINER */}
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
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
                      <button className="text-red-600 hover:underline">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-4 md:hidden">
          {devices.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum dispositivo cadastrado
            </p>
          ) : (
            devices.map((device) => (
              <div
                key={device.id}
                className="border rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div>
                  <p className="text-xs text-gray-400">ID: {device.id}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {device.nome}
                  </p>
                </div>

                <button className="text-red-600 text-sm font-medium self-end">
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
