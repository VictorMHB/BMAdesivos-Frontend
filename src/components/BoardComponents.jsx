import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { X, Archive } from "lucide-react";

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

export function OrdemCard({ ordem, onCancelar, onArquivar, isDragging = false }) {
  const podeCancelar = ordem.status === "PENDENTE" || ordem.status === "EM_PRODUCAO";
  const podArquivar = ordem.status === "CONCLUIDO";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{ordem.adesivo?.nome || "—"}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ordem.cliente?.nome || "—"}</p>
        </div>
        <div className="flex gap-1 ml-2">
          {podArquivar && (
            <button onClick={(e) => { e.stopPropagation(); onArquivar(ordem.id); }} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Arquivar ordem">
              <Archive size={15} />
            </button>
          )}
          {podeCancelar && (
            <button onClick={(e) => { e.stopPropagation(); onCancelar(ordem.id); }} className="p-1 rounded-full text-red-400 hover:bg-red-50 transition-colors cursor-pointer" title="Cancelar ordem">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipo(ordem.adesivo?.tipoAdesivo)}`}>
        {formatarTipo(ordem.adesivo?.tipoAdesivo)}
      </span>

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


function DraggableCard({ ordem, onCancelar, onArquivar }) {
  const podeMover = ordem.status === "PENDENTE" || ordem.status === "EM_PRODUCAO";

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
        onArquivar={onArquivar}
        isDragging={isDragging}
      />
    </div>
  );
}


export default function BoardColumn({ coluna, ordens, onCancelar, onArquivar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.id });

  return (
    <div className="flex flex-col flex-1 min-w-[280px]">
      <div className={`${coluna.color} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <span className="text-white font-semibold text-sm">{coluna.label}</span>
        <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {ordens.length}
        </span>
      </div>
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
            onArquivar={onArquivar}
          />
        ))}
        {ordens.length === 0 && (
          <p className="text-center text-gray-300 text-xs pt-4">Nenhuma ordem</p>
        )}
      </div>
    </div>
  );
}