import { useState } from "react";
import Button from "./Button";

export default function Form({ onClose }) {
  const [form, setForm] = useState({
    device: "",
    type: "",
    convenient: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Formulário enviado!");
    onClose();
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

          {/* BOTÃO FECHAR */}
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
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        >
          <option value="">Selecione o tipo</option>
          <option value="agua">Água</option>
          <option value="energia">Energia</option>
        </select>

        <select
          name="convenient"
          value={form.convenient}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
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
          className="w-full mb-4 p-3 border rounded-lg h-32 resize-none"
        />
        <Button className="w-full" text="Enviar" type="submit" />
      </form>
    </div>
  );
}
