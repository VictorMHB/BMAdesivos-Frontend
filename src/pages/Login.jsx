import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

      const {
        token,
        nome,
        cargo,
        requerTrocarSenha,
        id,
        email: emailResponse,
        telefone,
      } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioNome", nome);
      localStorage.setItem("usuarioCargo", cargo);
      localStorage.setItem("usuarioId", id);
      localStorage.setItem("requerTrocarSenha", requerTrocarSenha);

      localStorage.setItem("usuarioEmail", emailResponse ?? "");
      localStorage.setItem("usuarioTelefone", telefone ?? "");

      if (requerTrocarSenha) {
        navigate("/perfil");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erro capturado no catch:", err);

      const dadosErro = err.response?.data;

      if (typeof dadosErro === "object" && dadosErro !== null) {
        setError(
          dadosErro.erro || dadosErro.message || "Erro ao realizar login",
        );
      } else {
        setError(dadosErro || "Erro ao realizar login");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-2xl">
        
        <div className="text-center mb-8">
          <span className="text-xl font-bold text-gray uppercase tracking-widest">
            BM Adesivos
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-blue mb-8">
          LOGIN
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-blue mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@bmadesivos.com"
              className="w-full px-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-blue mb-2">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Insira sua senha"
              className="w-full px-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mt-2">
              <p className="text-red-500 text-sm text-center font-semibold">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center pt-4">
            <button
              type="submit"
              className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:opacity-90 transition duration-300"
            >
              Entrar
            </button>

            <Link
              to="/recuperar-senha"
              className="text-sm text-blue font-bold hover:underline mt-6 transition-all"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
