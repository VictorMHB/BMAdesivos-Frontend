import React from 'react';
import { X, Package } from 'lucide-react';

const formatarTamanhoEmbalagem = (tamanho) => {
  const tamanhos = { ML_750: "750mL", L_1: "1L" };
  return tamanhos[tamanho] || tamanho;
};

const formatarTipo = (tipo) => {
  const tipos = { SUBSTRATO: "Substrato", TINTA: "Tinta", RESINA: "Resina", OUTRO: "Outro" };
  return tipos[tipo] || tipo;
};

export default function ModalInsumos({ isOpen, onClose, insumo }) {
  if (!isOpen || !insumo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Cabeçalho */}
        <div className="bg-blue p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="text-blue-300" />
            Detalhes do Insumo
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-6">

          {/* Identificação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
              <p className="text-gray-900 font-medium text-lg">{insumo.nome}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Tipo</label>
              <p className="text-gray-900 font-medium">{formatarTipo(insumo.tipoInsumo)}</p>
            </div>
          </div>

          {insumo.descricao && (
            <>
              <hr className="border-gray-100" />
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Descrição</label>
                <p className="text-gray-700 mt-1">{insumo.descricao}</p>
              </div>
            </>
          )}

          <hr className="border-gray-100" />

          {/* Campos específicos por tipo */}
          {insumo.tipoInsumo === "SUBSTRATO" && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Dimensões</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Largura</p>
                  <p className="text-sm font-medium text-gray-800">
                    {insumo.largura != null ? `${insumo.largura} m` : "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Comprimento</p>
                  <p className="text-sm font-medium text-gray-800">
                    {insumo.comprimento != null ? `${insumo.comprimento} m` : "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">m²</p>
                  <p className="text-sm font-medium text-gray-800">
                    {insumo.metrosQuadrados != null ? `${insumo.metrosQuadrados} m²` : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {insumo.tipoInsumo === "TINTA" && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Detalhes da Tinta</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Cor</p>
                  <p className="text-sm font-medium text-gray-800">{insumo.cor || "—"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Tamanho Embalagem</p>
                  <p className="text-sm font-medium text-gray-800">
                    {insumo.tamanhoEmbalagem ? formatarTamanhoEmbalagem(insumo.tamanhoEmbalagem) : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          {/* Estoque e Valor */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Estoque e Valor</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Estoque Atual</p>
                <p className="text-sm font-medium text-gray-800">
                  {insumo.estoqueAtual}
                  {insumo.tipoInsumo === "SUBSTRATO" && " m²"}
                  {insumo.tipoInsumo === "TINTA" && " un"}
                  {insumo.tipoInsumo === "RESINA" && " kg"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Valor Unitário</p>
                <p className="text-sm font-medium text-gray-800">
                  {insumo.valorUnitario != null
                    ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}`
                    : "—"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Valor Total</p>
                <p className="text-sm font-medium text-gray-800">
                  {insumo.valorUnitario != null && insumo.estoqueAtual != null
                    ? `R$ ${(insumo.valorUnitario * insumo.estoqueAtual).toFixed(2).replace(".", ",")}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}