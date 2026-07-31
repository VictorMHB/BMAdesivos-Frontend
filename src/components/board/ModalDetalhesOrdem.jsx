import { useEffect } from "react";
import { X, ClipboardList, User, Calendar, Package } from "lucide-react";
import { calcularResumoItens } from "../../domain/ordemItens";
import { formatarTipoAdesivo, badgeTipoAdesivo } from "../../domain/adesivoTipo";
import { formatarData, formatarMoeda } from "../../utils/formatters";

export function ModalDetalhesOrdem({ ordem, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!ordem) return null;

  const { totalUnidades, tiposUnicos } = calcularResumoItens(ordem.itens);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-detalhes-ordem-titulo"
      >
        <div className="bg-blue p-5 flex justify-between items-center">
          <h2 id="modal-detalhes-ordem-titulo" className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-300" />
            Detalhes da Ordem #{ordem.id}
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <User size={11} /> Cliente
              </p>
              <p className="text-sm font-semibold text-gray-800">{ordem.clienteNome || "—"}</p>
            </div>
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <User size={11} /> Responsável
              </p>
              <p className="text-sm font-semibold text-gray-800">{ordem.funcionarioNome || "—"}</p>
            </div>
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={11} /> Abertura
              </p>
              <p className="text-sm font-semibold text-gray-800">{formatarData(ordem.dataAbertura)}</p>
            </div>
            {ordem.dataConclusao && (
              <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={11} /> Conclusão
                </p>
                <p className="text-sm font-semibold text-gray-800">{formatarData(ordem.dataConclusao)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-light-blue rounded-lg p-3 text-center">
              <p className="text-xs text-blue font-semibold uppercase tracking-wider mb-1">Total un.</p>
              <p className="text-xl font-bold text-blue">{totalUnidades}</p>
            </div>
            <div className="bg-light-blue rounded-lg p-3 text-center">
              <p className="text-xs text-blue font-semibold uppercase tracking-wider mb-1">Tipos</p>
              <p className="text-xl font-bold text-blue">{tiposUnicos.length}</p>
            </div>
            <div className="bg-light-green rounded-lg p-3 text-center">
              <p className="text-xs text-green font-semibold uppercase tracking-wider mb-1">Valor total</p>
              <p className="text-base font-bold text-green">{formatarMoeda(ordem.valorTotal)}</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Package size={11} /> Adesivos da ordem
            </p>
            <div className="space-y-2">
              {ordem.itens?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border border-ice rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.adesivoNome}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipoAdesivo(item.tipoAdesivo)}`}>
                      {formatarTipoAdesivo(item.tipoAdesivo)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{item.quantidade} un</p>
                    <p className="text-xs text-gray-400">{formatarMoeda(item.valorUnitario)} / un</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhesOrdem;