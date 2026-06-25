import React, { useState, useEffect } from "react";
import { X, PackagePlus } from "lucide-react";
import { toast } from "react-toastify";
import insumoService from "../../services/insumoService";
import { maskMoeda } from "../../utils/masks";

const labelQuantidade = {
  SUBSTRATO: "Rolos Comprados",
  TINTA: "Quantidade (un)",
  RESINA: "Quantidade (kg)",
};

export default function ModalEntradaInsumo({ isOpen, onClose, insumo, onSuccess }) {
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuantidade("");
      setValorUnitario(
        insumo?.valorUnitario != null
          ? maskMoeda(String(Math.round(insumo.valorUnitario * 100)))
          : ""
      );
      setErro("");
    }
  }, [isOpen, insumo]);

  if (!isOpen || !insumo) return null;

  const handleValorChange = (e) => {
    setValorUnitario(maskMoeda(e.target.value));
  };

  const m2PorRolo = insumo.metrosQuadrados;
  const quantidadeNum = Number(quantidade);
  const previaEstoque =
    insumo.tipoInsumo === "SUBSTRATO"
      ? quantidade && m2PorRolo
        ? (Number(quantidade) * m2PorRolo).toFixed(2)
        : null
      : quantidade
        ? quantidadeNum.toFixed(2)
        : null;

  const handleConfirmar = async () => {
    setErro("");

    if (!quantidade || quantidadeNum <= 0) {
      setErro("Informe uma quantidade maior que zero.");
      return;
    }

    if (
      (insumo.tipoInsumo === "SUBSTRATO" || insumo.tipoInsumo === "TINTA") &&
      !Number.isInteger(quantidadeNum)
    ) {
      setErro(
        insumo.tipoInsumo === "SUBSTRATO"
          ? "A quantidade de rolos deve ser um número inteiro."
          : "A quantidade de cartuchos deve ser um número inteiro."
      );
      return;
    }

    if (insumo.tipoInsumo === "SUBSTRATO" && (!m2PorRolo || m2PorRolo <= 0)) {
      setErro("Este substrato não possui m² por rolo cadastrado. Edite o insumo antes de registrar entrada.");
      return;
    }

    const dadosLimpos = {
      quantidade: quantidadeNum,
      valorUnitario: valorUnitario
        ? Number(String(valorUnitario).replace(/\./g, "").replace(",", "."))
        : null,
    };

    setLoading(true);
    try {
      await insumoService.registrarEntrada(insumo.id, dadosLimpos);
      toast.success("Entrada registrada com sucesso!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao registrar entrada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Cabeçalho */}
        <div className="bg-blue p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PackagePlus className="text-blue-300" />
            Registrar Entrada de Estoque
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-6">

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Insumo</label>
            <p className="text-gray-900 font-medium text-lg">{insumo.nome}</p>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labelQuantidade[insumo.tipoInsumo] || "Quantidade"} *
              </label>
              <input
                type="number"
                min="0"
                step={insumo.tipoInsumo === "RESINA" ? "0.01" : "1"}
                placeholder={insumo.tipoInsumo === "RESINA" ? "0,00" : "Ex: 2"}
                className="w-full px-4 py-2 text-dark-gray bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Novo Valor Unit. (R$)
              </label>
              <input
                placeholder="0,00"
                className="w-full px-4 py-2 text-dark-gray bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                value={valorUnitario}
                onChange={handleValorChange}
              />
            </div>
          </div>

          {insumo.tipoInsumo === "SUBSTRATO" && (
            <p className="text-xs text-gray-500">
              m² por rolo cadastrado: <span className="font-medium">{m2PorRolo ?? "—"}</span>
            </p>
          )}

          {previaEstoque && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue font-medium">
                Estoque após entrada:{" "}
                <span className="font-bold">
                  {(Number(insumo.estoqueAtual) + Number(previaEstoque)).toFixed(2)}
                  {insumo.tipoInsumo === "SUBSTRATO" && " m²"}
                  {insumo.tipoInsumo === "TINTA" && " un"}
                  {insumo.tipoInsumo === "RESINA" && " kg"}
                </span>
                <span className="text-gray-500 ml-2">
                  ({insumo.estoqueAtual} atual + {previaEstoque} novo)
                </span>
              </p>
            </div>
          )}

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className="bg-green hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registrando..." : "Confirmar Entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}