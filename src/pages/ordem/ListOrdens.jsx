import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import ordemService from "../../services/ordemService";
import FormOrdem from "./FormOrdem";
import { toast } from "react-toastify";
import { Plus, History } from "lucide-react";

import BoardColumn, { OrdemCard } from "../../components/BoardComponents";

const COLUNAS = [
  { id: "PENDENTE", label: "Pendente", color: "bg-yellow-400" },
  { id: "EM_PRODUCAO", label: "Em Produção", color: "bg-blue" },
  { id: "CONCLUIDO", label: "Concluído", color: "bg-green" },
];

function ListOrdens() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = () => {
    ordemService.getAll().then((res) => {
      setOrdens(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const ordemId = Number(active.id);
    const novoStatus = over.id;
    const ordem = ordens.find((o) => o.id === ordemId);
    if (!ordem || ordem.status === novoStatus) return;

    const fluxo = ["PENDENTE", "EM_PRODUCAO", "CONCLUIDO"];
    const indexAtual = fluxo.indexOf(ordem.status);
    const indexNovo = fluxo.indexOf(novoStatus);

    if (indexNovo !== indexAtual + 1) {
      toast.warning("Só é possível avançar uma etapa por vez.");
      return;
    }

    if (novoStatus === "CONCLUIDO") {
      setConfirmacao({ tipo: "finalizar", ordemId });
      return;
    }

    try {
      await ordemService.avancar(ordemId);
      toast.success("Ordem iniciada!");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao avançar ordem.");
    }
  };

  const handleFinalizar = async (ordemId) => {
    try {
      await ordemService.finalizar(ordemId);
      toast.success("Ordem finalizada! Estoque atualizado.");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao finalizar ordem.");
    } finally {
      setConfirmacao(null);
    }
  };

  const handleCancelar = async (ordemId) => {
    try {
      await ordemService.cancelar(ordemId);
      toast.success("Ordem cancelada.");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao cancelar ordem.");
    } finally {
      setConfirmacao(null);
    }
  };

  const handleArquivar = async (ordemId) => {
    try {
      await ordemService.arquivar(ordemId);
      toast.success("Ordem arquivada!");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao arquivar ordem.");
    }
  };

  const activeOrdem = ordens.find((o) => o.id === Number(activeId));

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Ordens de Produção</h1>
        <div className="flex gap-3">
          <Link
            to="/ordens/historico"
            className="border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
          >
            <History size={18} />
            Histórico
          </Link>
          <button
            onClick={() => setModalFormAberto(true)}
            className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={20} />
            Nova Ordem
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUNAS.map((coluna) => (
            <BoardColumn
              key={coluna.id}
              coluna={coluna}
              ordens={ordens.filter((o) => o.status === coluna.id)}
              onCancelar={(id) => setConfirmacao({ tipo: "cancelar", ordemId: id })}
              onArquivar={handleArquivar}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOrdem && (
            <div className="rotate-2 shadow-xl">
              <OrdemCard ordem={activeOrdem} onCancelar={() => {}} onArquivar={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {modalFormAberto && (
        <FormOrdem
          onClose={() => setModalFormAberto(false)}
          onSucesso={() => { setModalFormAberto(false); carregarOrdens(); }}
        />
      )}

      {confirmacao && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmacao.tipo === "finalizar" ? "Finalizar Ordem?" : "Cancelar Ordem?"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {confirmacao.tipo === "finalizar"
                ? "Ao confirmar, o estoque dos insumos será descontado automaticamente. Essa ação não pode ser desfeita."
                : "Deseja realmente cancelar esta ordem de produção?"}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmacao(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() =>
                  confirmacao.tipo === "finalizar"
                    ? handleFinalizar(confirmacao.ordemId)
                    : handleCancelar(confirmacao.ordemId)
                }
                className={`px-4 py-2 text-white font-bold rounded-md transition-colors cursor-pointer ${
                  confirmacao.tipo === "finalizar"
                    ? "bg-green hover:bg-green-800"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmacao.tipo === "finalizar" ? "Confirmar e Baixar" : "Cancelar Ordem"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrdens;