import React, { useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { X, Archive, ClipboardList, User, Calendar, Package, DollarSign } from "lucide-react";

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

const formatarMoeda = (valor) => {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const badgeTipo = (tipo) => {
  const map = {
    ETIQUETA_METALICA: "bg-gray-100 text-gray-600",
    ADESIVO_COMUM: "bg-light-blue text-blue",
    ADESIVO_RESINADO: "bg-yellow-100 text-yellow-700",
  };
  return map[tipo] || "bg-gray-100 text-gray-600";
};

function ModalDetalhesOrdem({ ordem, onClose }) {
  if (!ordem) return null;

  const totalItens = ordem.itens?.reduce((acc, i) => acc + i.quantidade, 0) ?? 0;
  const tiposUnicos = [...new Set(ordem.itens?.map((i) => i.tipoAdesivo) ?? [])];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="bg-blue p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-300" />
            Detalhes da Ordem #{ordem.id}
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Informações gerais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <User size={11} /> Cliente
              </p>
              <p className="text-sm font-semibold text-gray-800">{ordem.clienteNome || "—"}</p>
            </div>
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <User size={11} /> Responsável
              </p>
              <p className="text-sm font-semibold text-gray-800">{ordem.funcionarioNome || "—"}</p>
            </div>
            <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={11} /> Abertura
              </p>
              <p className="text-sm font-semibold text-gray-800">{formatarData(ordem.dataAbertura)}</p>
            </div>
            {ordem.dataConclusao && (
              <div className="bg-light-gray/40 border border-ice rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={11} /> Conclusão
                </p>
                <p className="text-sm font-semibold text-gray-800">{formatarData(ordem.dataConclusao)}</p>
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-light-blue rounded-lg p-3 text-center">
              <p className="text-xs text-blue font-semibold uppercase tracking-wider mb-1">Total un.</p>
              <p className="text-xl font-bold text-blue">{totalItens}</p>
            </div>
            <div className="bg-light-blue rounded-lg p-3 text-center">
              <p className="text-xs text-blue font-semibold uppercase tracking-wider mb-1">Tipos</p>
              <p className="text-xl font-bold text-blue">{tiposUnicos.length}</p>
            </div>
            <div className="bg-light-green rounded-lg p-3 text-center">
              <p className="text-xs text-green font-semibold uppercase tracking-wider mb-1">Valor total</p>
              <p className="text-base font-bold text-green">{formatarMoeda(ordem.valorTotal)}</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Lista de adesivos */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Package size={11} /> Adesivos da ordem
            </p>
            <div className="space-y-2">
              {ordem.itens?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border border-ice rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.adesivoNome}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipo(item.tipoAdesivo)}`}>
                      {formatarTipo(item.tipoAdesivo)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{item.quantidade} un</p>
                    <p className="text-xs text-gray-400">{formatarMoeda(item.valorUnitario)} / un</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function OrdemCard({ ordem, onCancelar, onArquivar, onClick, isDragging = false }) {
  const podeCancelar = ordem.status === "PENDENTE" || ordem.status === "EM_PRODUCAO";
  const podeArquivar = ordem.status === "CONCLUIDO";

  const totalItens = ordem.itens?.reduce((acc, i) => acc + i.quantidade, 0) ?? 0;
  const primeiroAdesivo = ordem.itens?.[0];
  const qtdTipos = new Set(ordem.itens?.map((i) => i.tipoAdesivo) ?? []).size;

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
        <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          {podeArquivar && (
            <button onClick={() => onArquivar(ordem.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Arquivar ordem">
              <Archive size={15} />
            </button>
          )}
          {podeCancelar && (
            <button onClick={() => onCancelar(ordem.id)} className="p-1 rounded-full text-red-400 hover:bg-red-50 transition-colors cursor-pointer" title="Cancelar ordem">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {primeiroAdesivo && (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeTipo(primeiroAdesivo.tipoAdesivo)}`}>
          {formatarTipo(primeiroAdesivo.tipoAdesivo)}
          {qtdTipos > 1 && <span className="ml-1 text-gray-400">+{qtdTipos - 1}</span>}
        </span>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Total</p>
          <p className="font-medium text-gray-700">{totalItens} un</p>
        </div>
        <div>
          <p className="text-gray-400">Adesivos</p>
          <p className="font-medium text-gray-700">{ordem.itens?.length ?? 0} tipo(s)</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-400">Abertura</p>
          <p className="font-medium text-gray-700">{formatarData(ordem.dataAbertura)}</p>
        </div>
      </div>
    </div>
  );
}

function DraggableCard({ ordem, onCancelar, onArquivar, onClickDetalhes }) {
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
        onClick={onClickDetalhes}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function BoardColumn({ coluna, ordens, onCancelar, onArquivar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.id });
  const [ordemDetalhes, setOrdemDetalhes] = useState(null);

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
            onClickDetalhes={() => setOrdemDetalhes(ordem)}
          />
        ))}
        {ordens.length === 0 && (
          <p className="text-center text-gray-300 text-xs pt-4">Nenhuma ordem</p>
        )}
      </div>

      {ordemDetalhes && (
        <ModalDetalhesOrdem
          ordem={ordemDetalhes}
          onClose={() => setOrdemDetalhes(null)}
        />
      )}
    </div>
  );
}