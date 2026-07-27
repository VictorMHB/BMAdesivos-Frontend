import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [redefinido, setRedefinido] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    if (novaSenha.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      await api.post("/auth/redefinir-senha", { token, novaSenha });
      setRedefinido(true);
    } catch (err) {
      const dadosErro = err.response?.data;
      setError(
        typeof dadosErro === "string"
          ? dadosErro
          : dadosErro?.erro || dadosErro?.message || "Link inválido ou expirado."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="w-full max-w-xl p-10 bg-white rounded-xl shadow-2xl">

        <div className="relative flex items-center justify-center mb-12">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-pointer absolute left-0 text-blue hover:opacity-70 transition"
            aria-label="Voltar para o login"
          >
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>

          <span className="text-xl font-bold text-gray uppercase tracking-widest">
            BM Adesivos
          </span>
        </div>

        {!redefinido ? (
          <>
            <h1 className="text-3xl font-bold text-center text-blue mb-2">
              Redefinir senha
            </h1>

            <p className="text-sm text-dark-gray text-center mb-8">
              Escolha uma nova senha para acessar sua conta. Ela deve ter no
              mínimo 8 caracteres.
            </p>

            {!token ? (
              <p className="text-red-500 text-sm text-center font-semibold">
                Link inválido ou incompleto. Solicite a recuperação novamente.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full mb-6">
                  <label
                    htmlFor="novaSenha"
                    className="block text-sm font-semibold text-blue mb-2"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue"
                      size={18}
                    />
                    <input
                      id="novaSenha"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-10 pr-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                      disabled={enviando}
                    />
                  </div>
                </div>

                <div className="w-full mb-6">
                  <label
                    htmlFor="confirmarSenha"
                    className="block text-sm font-semibold text-blue mb-2"
                  >
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue"
                      size={18}
                    />
                    <input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Repita a nova senha"
                      className="w-full pl-10 pr-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                      disabled={enviando}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center font-semibold mb-4">
                    {error}
                  </p>
                )}

                <div className="flex w-full mt-8">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:opacity-90 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {enviando ? "Salvando..." : "Redefinir senha"}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-green" size={32} strokeWidth={2} />
              <h1 className="text-2xl font-bold text-blue">
                Senha redefinida!
              </h1>
            </div>

            <p className="text-sm text-dark-gray mb-6">
              Sua senha foi alterada com sucesso. Agora você já pode entrar
              no sistema com a nova senha.
            </p>

            <div className="border-t border-light-gray pt-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:opacity-90 transition duration-300"
              >
                Ir para o login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RedefinirSenha;