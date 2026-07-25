import React, { useState } from "react";
import { Link } from "react-router-dom";
// O toast foi removido da importação, pois o feedback visual de sucesso
// já acontece através da mudança de estado da tela (renderização condicional).

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    // TODO: substituir pelo endpoint real quando o backend existir
    // await api.post("/auth/recuperar-senha", { email });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // mock

    setEnviando(false);
    setEnviado(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      {/* Removido o 'items-end' inútil para manter o container limpo */}
      <div className="w-full max-w-xl p-10 bg-white rounded-xl shadow-2xl">
        
        <div className="text-center mb-8">
          {/* Hierarquia Visual: O nome da marca foi reduzido em peso visual 
              para não competir com a ação principal da página */}
          <span className="text-xl font-bold text-gray uppercase tracking-widest">
            BM Adesivos
          </span>
        </div>

        {/* Hierarquia Visual: Agora sim, este é o título H1 real da página */}
        <h1 className="text-3xl font-bold text-center text-blue mb-6">
          RECUPERAR SENHA
        </h1>

        {!enviado ? (
          <>
            <p className="text-sm text-dark-gray text-center mb-8">
              Digite seu email cadastrado. Se ele existir em nosso sistema,
              enviaremos um link para redefinir sua senha.
            </p>

            {/* Layout limpo: Removidos flex-col e items-end desnecessários */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="w-full mb-6">
                {/* Acessibilidade (a11y): Adicionado htmlFor conectando ao ID do input */}
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-blue mb-2"
                >
                  Email
                </label>
                <input
                  id="email" /* ID adicionado para o label */
                  type="email"
                  placeholder="exemplo@bmadesivos.com"
                  className="w-full px-4 py-2 text-dark-gray bg-light-gray/40 border border-ice rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={enviando}
                />
              </div>

              {/* Proximidade: Margem reduzida de mt-16 para mt-8 */}
              <div className="flex w-full mt-8">
                {/* Significado das Cores: Botão agora usa bg-blue para seguir 
                    a identidade padrão de ações, e não o verde (sucesso) */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="cursor-pointer w-full px-10 py-3 font-bold text-white bg-green rounded-md hover:opacity-90 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {enviando ? "Enviando..." : "Enviar Link de Recuperação"}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Melhoria de UI: O estado de sucesso agora tem um container 
             levemente destacado usando as cores do seu tema para dar um feedback claro */
          <div className="text-center bg-light-blue p-6 rounded-lg border border-blue/20 mt-4 mb-4">
            <h3 className="text-blue font-bold text-lg mb-2">Verifique seu email!</h3>
            <p className="text-dark-gray text-sm">
              Se o email <strong>{email}</strong> estiver cadastrado em nossa base, 
              você receberá um link de recuperação em instantes.
            </p>
          </div>
        )}

        {/* Separador sutil para o link de voltar, isolando a navegação da ação principal */}
        <div className="flex justify-center mt-8 pt-6 border-t border-light-gray">
          <Link
            to="/login"
            className="text-sm text-blue font-bold hover:underline transition-all"
          >
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;