import { Archive, Eye, X } from "lucide-react";
import { podeCancelarOrdem, podeArquivarOrdem } from "../../domain/ordemStatus";
import { calcularResumoItens } from "../../domain/ordemItens";
import { formatarTipoAdesivo, badgeTipoAdesivo } from "../../domain/adesivoTipo";
import { formatarData } from "../../utils/formatters";

export function OrdemCard({ ordem, onCancelar, onArquivar, onClick, isDragging = false }) {
  const podeCancelar = podeCancelarOrdem(ordem.status);
  const podeArquivar = podeArquivarOrdem(ordem.status);

  const { totalUnidades, tiposUnicos } = calcularResumoItens(ordem.itens);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
          <p className="font-semibold text-gray-900 text-sm leading-tight">{ordem.clienteNome || "—"}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ordem.funcionarioNome || "—"}</p>
        </div>
        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClick}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue transition-colors cursor-pointer"
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
          {podeArquivar && (
            <button
              onClick={() => onArquivar(ordem.id)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              title="Arquivar ordem"
            >
              <Archive size={15} />
            </button>
          )}
          {podeCancelar && (
            <button
              onClick={() => onCancelar(ordem.id)}
              className="p-1 rounded-full text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
              title="Cancelar ordem"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {tiposUnicos.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400">Tipo:</span>
          {tiposUnicos.map((tipo) => (
            <span
              key={tipo}
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipoAdesivo(tipo)}`}
            >
              {formatarTipoAdesivo(tipo)}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Total</p>
          <p className="font-medium text-gray-700">{totalUnidades} un</p>
        </div>
        <div>
          <p className="text-gray-400">Abertura</p>
          <p className="font-medium text-gray-700">{formatarData(ordem.dataAbertura)}</p>
        </div>
        <div>
          <p className="text-gray-400">Prazo</p>
          {/* TODO: campo ordem.dataPrazo ainda não existe na API.
              Placeholder "—" até o back adicionar o campo. */}
          <p className="font-medium text-gray-700">{formatarData(ordem.dataPrazo)}</p>
        </div>
      </div>
    </div>
  );
}

export default OrdemCard;