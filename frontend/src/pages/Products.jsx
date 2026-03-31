import { useState } from "react";
import Form from "../components/Form";
import Button from "../components/Button";

export default function Products() {
  const [showForm, setShowForm] = useState(false);

  //  vindo do banco de dados
  const products = [];

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 m-auto">Produtos</h1>

        <Button
          text={showForm ? "Fechar" : "+ Adicionar"}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl"
        />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow">
          {showForm && <Form onClose={() => setShowForm(false)} />}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden m-auto w-3xl px-5 py-5">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Preço</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Nenhum produto cadastrado
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">{product.name}</td>
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
