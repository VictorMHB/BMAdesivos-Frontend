import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import ordemService from "../../services/ordemService";
import FormOrdem from "./FormOrdem";
import { toast } from "react-toastify";
import { Plus, X, CheckCircle } from "lucide-react";

// ── Mapeamento de colunas ──────────────────────────────────────────
const COLUNAS = [
  { id: "PENDENTE", label: "Pendente", color: "bg-yellow-400" },
  { id: "EM_PRODUCAO", label: "Em Produção", color: "bg-blue" },
  { id: "CONCLUIDO", label: "Concluído", color: "bg-green" },
  { id: "CANCELADO", label: "Cancelado", color: "bg-red-400" },
];

const formatarTipo = (tipo) => {
  const tipos = {
    ETIQUETA_METALICA: "Etiqueta Metálica",
    ADESIVO_COMUM: "Adesivo Comum",
    ADESIVO_RESINADO: "Adesivo Resinado",
  };
  return tipos[tipo] || tipo;
};

const formatarData = (data) => {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const badgeTipo = (tipo) => {
  const map = {
    ETIQUETA_METALICA: "bg-gray-100 text-gray-600",
    ADESIVO_COMUM: "bg-blue-100 text-blue",
    ADESIVO_RESINADO: "bg-yellow-100 text-yellow-700",
  };
  return map[tipo] || "bg-gray-100 text-gray-600";
};

// ── Card individual ────────────────────────────────────────────────
function OrdemCard({ ordem, onCancelar, onFinalizar, isDragging = false }) {
  const podeCancelar = ordem.status !== "CONCLUIDO" && ordem.status !== "CANCELADO";
  const podeFinalizar = ordem.status === "EM_PRODUCAO";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 ${isDragging ? "opacity-50" : ""}`}>
      {/* Cabeçalho do card */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{ordem.adesivo?.nome || "—"}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ordem.cliente?.nome || "—"}</p>
        </div>
        <div className="flex gap-1 ml-2">
          {podeFinalizar && (
            <button
              onClick={(e) => { e.stopPropagation(); onFinalizar(ordem.id); }}
              className="p-1 rounded-full text-green hover:bg-green-50 transition-colors cursor-pointer"
              title="Finalizar e baixar estoque"
            >
              <CheckCircle size={15} />
            </button>
          )}
          {podeCancelar && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancelar(ordem.id); }}
              className="p-1 rounded-full text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
              title="Cancelar ordem"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Badge tipo adesivo */}
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipo(ordem.adesivo?.tipoAdesivo)}`}>
        {formatarTipo(ordem.adesivo?.tipoAdesivo)}
      </span>

      {/* Infos */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Quantidade</p>
          <p className="font-medium text-gray-700">{ordem.qtdPedida} un</p>
        </div>
        <div>
          <p className="text-gray-400">Responsável</p>
          <p className="font-medium text-gray-700 truncate">{ordem.funcionario?.nome || "—"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-400">Abertura</p>
          <p className="font-medium text-gray-700">{formatarData(ordem.dataAbertura)}</p>
        </div>
      </div>
    </div>
  );
}

// ── Card arrastável ────────────────────────────────────────────────
function DraggableCard({ ordem, onCancelar, onFinalizar }) {
  const podeMover = ordem.status !== "CONCLUIDO" && ordem.status !== "CANCELADO";

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(ordem.id),
    disabled: !podeMover,
  });

  return (
    <div
      ref={setNodeRef}
      {...(podeMover ? { ...listeners, ...attributes } : {})}
      className={podeMover ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
    >
      <OrdemCard
        ordem={ordem}
        onCancelar={onCancelar}
        onFinalizar={onFinalizar}
        isDragging={isDragging}
      />
    </div>
  );
}

// ── Coluna do Kanban ───────────────────────────────────────────────
function KanbanColuna({ coluna, ordens, onCancelar, onFinalizar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.id });

  return (
    <div className="flex flex-col min-w-[260px] max-w-[280px] w-full">
      {/* Cabeçalho */}
      <div className={`${coluna.color} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <span className="text-white font-semibold text-sm">{coluna.label}</span>
        <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {ordens.length}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] p-3 space-y-3 rounded-b-xl border border-t-0 border-gray-100 transition-colors ${
          isOver ? "bg-blue-50" : "bg-gray-50/50"
        }`}
      >
        {ordens.map((ordem) => (
          <DraggableCard
            key={ordem.id}
            ordem={ordem}
            onCancelar={onCancelar}
            onFinalizar={onFinalizar}
          />
        ))}
        {ordens.length === 0 && (
          <p className="text-center text-gray-300 text-xs pt-4">Nenhuma ordem</p>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────
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

    if (novoStatus === "CANCELADO") {
      setConfirmacao({ tipo: "cancelar", ordemId });
      return;
    }

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
      toast.success("Ordem avançada para Em Produção!");
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

  const activeOrdem = ordens.find((o) => o.id === Number(activeId));

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Ordens de Produção</h1>
        <button
          onClick={() => setModalFormAberto(true)}
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={20} />
          Nova Ordem
        </button>
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUNAS.map((coluna) => (
            <KanbanColuna
              key={coluna.id}
              coluna={coluna}
              ordens={ordens.filter((o) => o.status === coluna.id)}
              onCancelar={(id) => setConfirmacao({ tipo: "cancelar", ordemId: id })}
              onFinalizar={(id) => setConfirmacao({ tipo: "finalizar", ordemId: id })}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOrdem && (
            <div className="rotate-2 shadow-xl">
              <OrdemCard ordem={activeOrdem} onCancelar={() => {}} onFinalizar={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal nova ordem */}
      {modalFormAberto && (
        <FormOrdem
          onClose={() => setModalFormAberto(false)}
          onSucesso={() => { setModalFormAberto(false); carregarOrdens(); }}
        />
      )}

      {/* Popup confirmação */}
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
                {confirmacao.tipo === "finalizar" ? "Confirmar e Baixar Estoque" : "Cancelar Ordem"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrdens;