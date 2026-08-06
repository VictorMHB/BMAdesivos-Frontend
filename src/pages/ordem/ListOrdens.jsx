import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { toast } from "react-toastify";
import { Plus, History } from "lucide-react";

import ordemService from "../../services/ordemService";
import FormOrdem from "./FormOrdem";
import BoardColumn, { OrdemCard, ModalDetalhesOrdem } from "../../components/board";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useAcaoOrdem } from "../../hooks/useAcaoOrdem";
import { podeAvancarPara } from "../../domain/ordemStatus";

const COLUNAS = [
  { id: "PENDENTE", label: "Pendente", color: "bg-orange" },
  { id: "EM_PRODUCAO", label: "Em Produção", color: "bg-blue" },
  { id: "CONCLUIDO", label: "Concluído", color: "bg-green" },
];

function ListOrdens() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [ordemDetalhes, setOrdemDetalhes] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const { executar } = useAcaoOrdem(setOrdens);

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

    if (!podeAvancarPara(ordem.status, novoStatus)) {
      toast.warning("Só é possível avançar uma etapa por vez.");
      return;
    }

    if (novoStatus === "CONCLUIDO") {
      setConfirmacao({ tipo: "finalizar", ordemId });
      return;
    }

    await executar({
      ordemId,
      acao: ordemService.avancar,
      msgSucesso: "Ordem iniciada!",
      msgErroFallback: "Erro ao avançar ordem.",
    });
  };

  const handleFinalizar = (ordemId) =>
    executar({
      ordemId,
      acao: ordemService.finalizar,
      msgSucesso: "Ordem finalizada! Estoque atualizado.",
      msgErroFallback: "Erro ao finalizar ordem.",
      onFinally: () => setConfirmacao(null),
    });

  const handleCancelar = (ordemId) =>
    executar({
      ordemId,
      acao: ordemService.cancelar,
      msgSucesso: "Ordem cancelada.",
      msgErroFallback: "Erro ao cancelar ordem.",
      onFinally: () => setConfirmacao(null),
    });

  const handleArquivar = (ordemId) =>
    executar({
      ordemId,
      acao: ordemService.arquivar,
      msgSucesso: "Ordem arquivada!",
      msgErroFallback: "Erro ao arquivar ordem.",
    });

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
              onClickOrdem={setOrdemDetalhes}
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

      {ordemDetalhes && (
        <ModalDetalhesOrdem
          ordem={ordemDetalhes}
          onClose={() => setOrdemDetalhes(null)}
        />
      )}

      {confirmacao && (
        <ConfirmModal
          titulo={confirmacao.tipo === "finalizar" ? "Finalizar Ordem?" : "Cancelar Ordem?"}
          mensagem={
            confirmacao.tipo === "finalizar"
              ? "Ao confirmar, o estoque dos insumos será descontado automaticamente. Essa ação não pode ser desfeita."
              : "Deseja realmente cancelar esta ordem de produção?"
          }
          textoConfirmar={confirmacao.tipo === "finalizar" ? "Confirmar e Baixar" : "Cancelar Ordem"}
          textoCancelar="Voltar"
          corBotao={confirmacao.tipo === "finalizar" ? "green" : "red"}
          onCancel={() => setConfirmacao(null)}
          onConfirm={() =>
            confirmacao.tipo === "finalizar"
              ? handleFinalizar(confirmacao.ordemId)
              : handleCancelar(confirmacao.ordemId)
          }
        />
      )}
    </div>
  );
}

export default ListOrdens;