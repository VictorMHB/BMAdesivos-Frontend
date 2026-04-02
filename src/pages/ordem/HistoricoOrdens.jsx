import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ordemService from "../../services/ordemService";
import { ArrowLeft, Search } from "lucide-react";

const formatarStatus = (status) => {
  const map = {
    CONCLUIDO: { label: "Concluído", class: "bg-green-100 text-green-700" },
    CANCELADO: { label: "Cancelado", class: "bg-red-100 text-red-600" },
  };
  return map[status] || { label: status, class: "bg-gray-100 text-gray-600" };
};

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

function HistoricoOrdens() {
  const navigate = useNavigate();
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    ordemService.getHistorico().then((res) => {
      setOrdens(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/ordens")}
          className="p-2 hover:bg-light-gray rounded-full transition-colors text-blue hover:text-blue-900 cursor-pointer"
          title="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">Histórico de Ordens</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por adesivo ou cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
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
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-800">{ordensFiltradas.length}</span> ordens
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Adesivo</th>
                <th className="px-6 py-4 border-b">Tipo</th>
                <th className="px-6 py-4 border-b">Cliente</th>
                <th className="px-6 py-4 border-b">Funcionário</th>
                <th className="px-6 py-4 border-b">Qtd</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b">Abertura</th>
                <th className="px-6 py-4 border-b">Conclusão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordensFiltradas.map((ordem) => {
                const status = formatarStatus(ordem.status);
                return (
                  <tr key={ordem.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{ordem.adesivo?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatarTipo(ordem.adesivo?.tipoAdesivo)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.cliente?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.funcionario?.nome || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ordem.qtdPedida} un</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatarData(ordem.dataAbertura)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatarData(ordem.dataConclusao)}</td>
                  </tr>
                );
              })}
              {ordensFiltradas.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                    Nenhuma ordem encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoricoOrdens;