import { useState, useEffect } from "react";
import Form from "../components/Form";
import Button from "../components/Button";

const API = "https://piec1-api.onrender.com/api";

export default function Devices() {
  const [showForm, setShowForm] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarDispositivos() {
    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("token");

    console.log("===== BUSCAR DISPOSITIVOS =====");
    console.log("usuarioId:", usuarioId);
    console.log("token:", token);

    if (!usuarioId || !token) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      setLoading(true);

      const url = `${API}/dispositivos/meus-dispositivos`;

      console.log("GET:", url);

      const response = await fetch(url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Resposta GET:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar dispositivos");
      }

      setDevices(data);
    } catch (error) {
      console.error("Erro GET dispositivos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function cadastrarDispositivo(form) {
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (!token || !usuarioId) {
      alert("Usuário não autenticado");

      return;
    }

    const body = {
      nome: form.device,

      tipoLeitura: form.type,

      limiteAlerta: form.limit ? Number(form.limit) : null,

      usuarioId: Number(usuarioId),
    };

    console.log("===== CADASTRO =====");

    console.log("POST:", `${API}/dispositivos`);

    console.log("Body enviado:", body);

    try {
      const response = await fetch(`${API}/dispositivos`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("Resposta POST:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar");
      }

      alert("Dispositivo cadastrado!");

      setShowForm(false);

      await buscarDispositivos();
    } catch (error) {
      console.error("Erro POST:", error);

      alert(error.message);
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
            onSubmit={cadastrarDispositivo}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>

              <th className="p-4">Nome</th>

              <th className="p-4">Tipo</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-6 text-center">
                  Carregando...
                </td>
              </tr>
            ) : devices.length === 0 ? (
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

                  <td className="p-4">{device.tipoLeitura}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
