import { useState } from "react";
import Button from "./Button";

export default function Form({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    device: "",
    type: "",
    convenient: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ device: "", type: "", convenient: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.device.trim()) {
      alert("O campo 'Nome do dispositivo' é obrigatório.");
      return;
    }

    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("token");

    if (!usuarioId || !token) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://web-production-2044e.up.railway.app/api/dispositivos/usuario/${usuarioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: form.device,
            tipo: form.type,
            comodo: form.convenient,
            descricao: form.description,
          }),
        },
      );

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: Não foi possível cadastrar o dispositivo.`;
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
          else if (errorData?.errors)
            errorMessage = errorData.errors
              .map((err) => err.defaultMessage || err.field)
              .join("\n");
        } catch {}
        throw new Error(errorMessage);
      }

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error.name === "TypeError") {
        alert("Erro de conexão: verifique sua internet e tente novamente.");
      } else {
        alert(`Falha ao cadastrar dispositivo:\n${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* FUNDO ESCURO */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cadastro de dispositivos</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* INPUTS */}
        <input
          type="text"
          name="device"
          placeholder="Nome do dispositivo"
          value={form.device}
          onChange={handleChange}
          disabled={loading}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          disabled={loading}
          className="w-full mb-4 p-3 border rounded-lg disabled:opacity-50"
        >
          <option value="">Selecione o tipo</option>
          <option value="agua">Água</option>
          <option value="energia">Energia</option>
        </select>

        <select
          name="convenient"
          value={form.convenient}
          onChange={handleChange}
          disabled={loading}
          className="w-full mb-4 p-3 border rounded-lg disabled:opacity-50"
        >
          <option value="">Selecione o cômodo</option>
          <option value="cozinha">Cozinha</option>
          <option value="banheiro">Banheiro</option>
          <option value="sala">Sala</option>
          <option value="quarto">Quarto</option>
          <option value="lavanderia">Lavanderia</option>
          <option value="outro">Outro</option>
        </select>

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
          className="w-full mb-4 p-3 border rounded-lg h-32 resize-none disabled:opacity-50"
        />

        <Button
          className="w-full"
          text={loading ? "Cadastrando..." : "Enviar"}
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
}
