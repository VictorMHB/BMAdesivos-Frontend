import React, { useState, useEffect } from "react";
import ordemService from "../../services/ordemService";
import adesivoService from "../../services/adesivoService";
import { toast } from "react-toastify";
import { Plus, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import FormOrdem from "./FormOrdem";

function ListOrdens() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null); // { tipo, ordemId }

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = () => {
    ordemService.getAll().then((res) => {
      setOrdens(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleAvancar = async (id) => {
    try {
      await ordemService.avancar(id);
      toast.success("Status atualizado!");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao avançar ordem.");
    }
  };

  const handleFinalizar = async (id) => {
    try {
      await ordemService.finalizar(id);
      toast.success("Ordem finalizada! Estoque atualizado.");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao finalizar ordem.");
    } finally {
      setConfirmacao(null);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await ordemService.cancelar(id);
      toast.success("Ordem cancelada.");
      carregarOrdens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao cancelar ordem.");
    } finally {
      setConfirmacao(null);
    }
  };

  const formatarStatus = (status) => {
    const map = {
      PENDENTE: { label: "Pendente", class: "bg-yellow-100 text-yellow-700" },
      EM_PRODUCAO: { label: "Em Produção", class: "bg-blue-100 text-blue" },
      CONCLUIDO: { label: "Concluído", class: "bg-green-100 text-green-700" },
      CANCELADO: { label: "Cancelado", class: "bg-red-100 text-red-600" },
    };
    return map[status] || { label: status, class: "bg-gray-100 text-gray-600" };
  };

  const formatarData = (data) => {
    if (!data) return "—";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const ordensFiltradas = ordens.filter((o) => {
    const matchBusca =
      o.adesivo?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      o.cliente?.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "TODOS" || o.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-6xl mx-auto">
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

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Filtros */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Buscar por adesivo ou cliente..."
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue bg-white"
            >
              <option value="TODOS">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_PRODUCAO">Em Produção</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-800">{ordensFiltradas.length}</span> ordens
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Adesivo</th>
                <th className="px-6 py-4 border-b">Cliente</th>
                <th className="px-6 py-4 border-b">Funcionário</th>
                <th className="px-6 py-4 border-b">Qtd</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b">Data Abertura</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordensFiltradas.map((ordem) => {
                const status = formatarStatus(ordem.status);
                return (
                  <tr key={ordem.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{ordem.adesivo?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.cliente?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.funcionario?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.qtdPedida}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatarData(ordem.dataAbertura)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {ordem.status === "PENDENTE" && (
                          <>
                            <button
                              onClick={() => handleAvancar(ordem.id)}
                              className="text-blue hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Iniciar Produção"
                            >
                              <PlayCircle size={18} />
                            </button>
                            <button
                              onClick={() => setConfirmacao({ tipo: "cancelar", ordemId: ordem.id })}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Cancelar"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {ordem.status === "EM_PRODUCAO" && (
                          <>
                            <button
                              onClick={() => setConfirmacao({ tipo: "finalizar", ordemId: ordem.id })}
                              className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Finalizar e baixar estoque"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setConfirmacao({ tipo: "cancelar", ordemId: ordem.id })}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                              title="Cancelar"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {ordensFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    Nenhuma ordem encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de nova ordem */}
      {modalFormAberto && (
        <FormOrdem
          onClose={() => setModalFormAberto(false)}
          onSucesso={() => { setModalFormAberto(false); carregarOrdens(); }}
        />
      )}

      {/* Popup de confirmação */}
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