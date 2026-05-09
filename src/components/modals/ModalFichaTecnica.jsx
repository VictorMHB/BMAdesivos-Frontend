import React from "react";
import { X, ClipboardList } from "lucide-react";

const formatarTipo = (tipo) => {
  const tipos = {
    ETIQUETA_METALICA: "Etiqueta Metálica",
    ADESIVO_COMUM: "Adesivo Comum",
    ADESIVO_RESINADO: "Adesivo Resinado",
  };
  return tipos[tipo] || tipo;
};

export default function ModalFichaTecnica({ isOpen, onClose, adesivo, itens }) {
  if (!isOpen || !adesivo) return null;

  const substrato = itens.find((i) => i.insumo.tipoInsumo === "SUBSTRATO");
  const resina = itens.find((i) => i.insumo.tipoInsumo === "RESINA");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="bg-blue p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-300" />
            Ficha Técnica
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Nome</p>
            <p className="text-lg font-semibold text-gray-900">{adesivo.nome}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Tipo</p>
              <p className="text-sm font-semibold text-gray-800">{formatarTipo(adesivo.tipoAdesivo)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Dimensões</p>
              <p className="text-sm font-semibold text-gray-800">
                {adesivo.comprimento && adesivo.altura
                  ? `${adesivo.comprimento} x ${adesivo.altura} cm`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Cliente</p>
            <p className="text-sm font-semibold text-gray-800">{adesivo.cliente?.nome || "—"}</p>
          </div>

          <hr className="border-gray-100" />

          {/* Substrato */}
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Substrato</p>
            {substrato ? (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-3">{substrato.insumo.nome}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Largura</p>
                    <p className="text-sm font-medium text-gray-800">
                      {substrato.insumo.largura != null ? `${substrato.insumo.largura} m` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Comprimento</p>
                    <p className="text-sm font-medium text-gray-800">
                      {substrato.insumo.comprimento != null ? `${substrato.insumo.comprimento} m` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total em Estoque</p>
                    <p className="text-sm font-medium text-gray-800">
                      {substrato.insumo.estoqueAtual != null ? `${substrato.insumo.estoqueAtual} m²` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Nenhum substrato cadastrado.</p>
            )}
          </div>

          {/* Resina — só para resinado */}
          {adesivo.tipoAdesivo === "ADESIVO_RESINADO" && (
            <>
              <hr className="border-gray-100" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Resina</p>
                {resina ? (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">{resina.insumo.nome}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Estoque: {resina.insumo.estoqueAtual != null ? `${resina.insumo.estoqueAtual} kg` : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Qtd. Usada</p>
                      <p className="text-sm font-medium text-gray-800">
                        {resina.quantidade != null ? `${resina.quantidade} kg` : "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm">Nenhuma resina cadastrada.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}