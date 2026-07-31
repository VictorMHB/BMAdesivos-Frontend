import { useDraggable } from "@dnd-kit/core";
import { podeMoverOrdem } from "../../domain/ordemStatus";
import OrdemCard from "./OrdemCard";

export function DraggableCard({ ordem, onCancelar, onArquivar, onClickDetalhes }) {
  const podeMover = podeMoverOrdem(ordem.status);

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
        onClick={onClickDetalhes}
        isDragging={isDragging}
      />
    </div>
  );
}

export default DraggableCard;