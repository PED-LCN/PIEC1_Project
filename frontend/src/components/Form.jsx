import { useState } from "react";
import Button from "./Button";

export default function Form() {
  const [form, setForm] = useState({
    product: "",
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cadastro de produtos
        </h2>

        {/* Nome */}
        <input
          type="text"
          name="product"
          placeholder="Nome do produto"
          value={form.product}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Tipo */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione o tipo</option>
          <option value="agua">Água 💧</option>
          <option value="energia">Energia ⚡</option>
        </select>

        {/* Cômodo */}
        <select
          name="convenient"
          value={form.convenient}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione o cômodo</option>
          <option value="cozinha">Cozinha</option>
          <option value="banheiro">Banheiro</option>
          <option value="sala">Sala</option>
          <option value="quarto">Quarto</option>
          <option value="lavanderia">Lavanderia</option>
          <option value="outro">Outro</option>
        </select>

        {/* Descrição */}
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Botão */}
        <Button
          className="w-full"
          text="Enviar"
          onClick={() => {
            console.log(form);
          }}
        />
      </form>
    </div>
  );
}
