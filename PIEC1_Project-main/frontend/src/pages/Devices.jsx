import { useState, useEffect } from "react";
import Form from "../components/Form";
import Button from "../components/Button";

export default function Devices() {
  const [showForm, setShowForm] = useState(false);
  const [devices, setDevices] = useState([]);

  async function buscarDispositivos() {
    try {
      const response = await fetch("http://localhost:3000/dispositivos");

      if (!response.ok) {
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
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 m-auto">
          Dispositivos
        </h1>

        <Button
          text={showForm ? "Fechar" : "+ Adicionar"}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl"
        />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow">
          <Form onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden m-auto w-3xl px-5 py-5">
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
                  <td className="p-4">{device.name}</td>
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
    </div>
  );
}
