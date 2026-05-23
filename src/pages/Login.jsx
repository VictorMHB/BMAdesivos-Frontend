import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, senha });
      
      // 1. Extraímos as variáveis corretas. 
      // Renomeamos o 'email' vindo da API para 'emailResponse' para não conflitar com o 'email' do state.
      // Substitua 'trocarSenha' pelo nome exato que está no seu DTO LoginResponse no Java.
      const { token, nome, cargo, trocarSenha, id, email: emailResponse, telefone } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioNome", nome);
      localStorage.setItem("usuarioCargo", cargo);
      localStorage.setItem("usuarioId", id);
      localStorage.setItem("requerTrocarSenha", trocarSenha);
      
      localStorage.setItem("usuarioEmail", emailResponse ?? '');
      localStorage.setItem("usuarioTelefone", telefone ?? '');

      if (trocarSenha) {
        navigate("/perfil");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Erro capturado no catch:", err); 
      
      const dadosErro = err.response?.data;
      
      // Verifica se a resposta do erro é um objeto
      if (typeof dadosErro === 'object' && dadosErro !== null) {
        // Tenta pegar a chave "erro" ou "message" que veio do backend
        setError(dadosErro.erro || dadosErro.message || "Erro ao realizar login");
      } else {
        // Se for um texto simples, usa ele direto
        setError(dadosErro || "Erro ao realizar login");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-2xl items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue">BM Adesivos</h1>
          <p className="text-sm text-blue font-medium">Gestão de Estoque</p>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue mb-6">LOGIN</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-blue">
              Email
            </label>
            <input
              type="email"
              placeholder="exemplo@bmadesivos.com"
              className="w-full px-4 py-2 mt-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue">Senha</label>
            <input
              type="password"
              placeholder="Insira sua senha"
              className="w-full px-4 py-2 mt-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:blue"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-semibold">
              {error}
            </p>
          )}

          <div className="flex justify-center mt-16">
            <button
              type="submit"
              className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:bg-green-800 transition duration-300"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
