import React, { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setEnviando(true);

    try {
      await api.post("/auth/recuperar-senha", { email });
    } catch (err) {
      console.error("Erro ao solicitar recuperação:", err);
    }

    setEnviando(false);
    setEnviado(true);
  };

  const handleReenviar = async () => {
    setEnviando(true);
    try {
      await api.post("/auth/recuperar-senha", { email });
    } catch (err) {
      console.error("Erro ao reenviar recuperação:", err);
    }
    setEnviando(false);
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

        {!enviado ? (
          <>
            <h1 className="text-3xl font-bold text-center text-blue mb-2">
              Esqueceu a senha?
            </h1>

            <p className="text-sm text-dark-gray text-center mb-8">
              Informe seu email cadastrado no sistema para enviarmos as
              instruções de redefinição da senha.
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-blue mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue"
                    size={18}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="exemplo@bmadesivos.com"
                    className="w-full pl-10 pr-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={enviando}
                  />
                </div>
              </div>

              <div className="flex w-full mt-8">
                <button
                  type="submit"
                  disabled={enviando}
                  className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:opacity-90 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {enviando ? "Enviando..." : "Continuar"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-green" size={32} strokeWidth={2} />
              <h1 className="text-2xl font-bold text-blue">
                Email enviado!
              </h1>
            </div>

            <p className="text-sm text-dark-gray mb-6">
              Uma mensagem com as instruções de redefinição da senha foi enviada para o seguinte email: <strong className="text-blue">{email}</strong>.
            </p>

            <div className="border-t border-light-gray pt-6">
              <p className="text-xs text-dark-gray/70 mb-4">
                Caso não tenha recebido a mensagem, verifique se digitou o
                email corretamente ou se caiu na caixa de spam.
              </p>

              <button
                type="button"
                onClick={handleReenviar}
                disabled={enviando}
                className="cursor-pointer text-sm text-blue font-bold hover:underline transition-all disabled:opacity-60"
              >
                {enviando ? "Reenviando..." : "Reenviar email"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecuperarSenha;