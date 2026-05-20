import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch(
        "https://web-production-2044e.up.railway.app/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Verifica todos os caminhos possíveis para o ID
        const idParaSalvar = data.user?.id || data.usuario?.id || data.id;

        if (idParaSalvar) {
          localStorage.setItem("usuarioId", idParaSalvar);
        } else {
          console.error(
            "ID do usuário não encontrado na resposta da API",
            data
          );
        }

        onLogin();
      } else {
        setErro(data.message || "E-mail ou senha incorretos");
      }
    } catch (error) {
      setErro("Não foi possível conectar ao servidor");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-950 to-black">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[400px] border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-emerald-900 mb-2">
          Eco Monitor
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Acesse sua conta para gerenciar dispositivos
        </p>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-r-md">
            <p className="text-red-600 text-xs font-semibold">{erro}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="pt-2">
            <Button text="Entrar" type="submit" className="w-full" />
          </div>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Ainda não tem acesso?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
            >
              Criar conta gratuita
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
