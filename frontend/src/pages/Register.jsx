import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Register({ onNavigateToLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch(
        "https://web-production-2044e.up.railway.app/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome, email, senha }),
        }
      );

      if (response.ok) {
        setSucesso(true);
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      } else {
        const data = await response.json();
        setErro(data.message || "Erro ao realizar cadastro.");
      }
    } catch (error) {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-950 to-black">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[400px] border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-emerald-900 mb-2">
          Criar Conta
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Junte-se ao monitoramento ecológico
        </p>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-r-md">
            <p className="text-red-600 text-xs font-semibold text-center">
              {erro}
            </p>
          </div>
        )}

        {sucesso && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mb-6 rounded-r-md">
            <p className="text-emerald-600 text-xs font-semibold text-center">
              Cadastro realizado! Redirecionando...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome"
            type="text"
            placeholder="Maria Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="maria@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha (mín. 6 caracteres)"
            type="password"
            placeholder="••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="pt-2">
            <Button
              text="Finalizar Cadastro"
              type="submit"
              className="w-full"
            />
          </div>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
            >
              Faça Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
