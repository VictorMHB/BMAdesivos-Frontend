import { useDroppable } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard";

export function BoardColumn({ coluna, ordens, onCancelar, onArquivar, onClickOrdem }) {
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
        className={`flex-1 min-h-[200px] p-3 space-y-3 rounded-b-xl border border-t-0 border-gray-100 transition-colors ${isOver ? "bg-blue-50" : "bg-gray-50/50"}`}
      >
        {ordens.map((ordem) => (
          <DraggableCard
            key={ordem.id}
            ordem={ordem}
            onCancelar={onCancelar}
            onArquivar={onArquivar}
            onClickDetalhes={() => onClickOrdem(ordem)}
          />
        ))}
        {ordens.length === 0 && (
          <p className="text-center text-gray-300 text-xs pt-4">Nenhuma ordem</p>
        )}
      </div>
    </div>
  );
}

export default BoardColumn;