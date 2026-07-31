import { useState } from "react";
import { toast } from "react-toastify";

export function useAcaoOrdem(setOrdens) {
  const [processando, setProcessando] = useState(null); // id da ordem em ação

  const executar = async ({ ordemId, acao, msgSucesso, msgErroFallback, onFinally }) => {
    setProcessando(ordemId);
    try {
      const { data: ordemAtualizada } = await acao(ordemId);
      setOrdens((prev) =>
        prev.map((o) => (o.id === ordemAtualizada.id ? ordemAtualizada : o))
      );
      toast.success(msgSucesso);
      return true;
    } catch (error) {
      toast.error(error.response?.data || msgErroFallback);
      return false;
    } finally {
      setProcessando(null);
      onFinally?.();
    }
  };

  return { executar, processando };
}