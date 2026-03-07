import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import insumoService from "../../services/insumoService";
import { Search, Plus, Pencil, PackageX, PackageCheck } from "lucide-react";

function ListInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarInsumos();
  }, []);

  const carregarInsumos = () => {
    insumoService
      .getAll()
      .then((response) => {
        setInsumos(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Erro ao buscar insumos:", e);
        setLoading(false);
      });
  };

  const handleAltStatus = async (insumo) => {
    const novoStatus = !insumo.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    if (window.confirm(`Deseja realmente ${acao} o insumo ${insumo.nome}?`)) {
      try {
        if (novoStatus) {
          await insumoService.patch(insumo.id, { ativo: true });
        } else {
          await insumoService.deletar(insumo.id);
        }
        alert(`Insumo ${novoStatus ? "ativado" : "inativado"} com sucesso!`);
        carregarInsumos();
      } catch (error) {
        console.error(error);
        alert("Erro ao alterar status do insumo.");
      }
    }
  };

  const insumosFiltrados = insumos.filter((i) =>
    i.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gerenciamento de Insumos</h1>
        <Link
          to="/insumos/novo"
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Insumo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Filtro */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-800">{insumosFiltrados.length}</span> insumos
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Nome</th>
                <th className="px-6 py-4 border-b">Unidade</th>
                <th className="px-6 py-4 border-b">Estoque Atual</th>
                <th className="px-6 py-4 border-b">Estoque Mínimo</th>
                <th className="px-6 py-4 border-b">Valor Unitário</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {insumosFiltrados.map((insumo) => (
                <tr key={insumo.id} className={`hover:bg-blue-50/30 transition-colors ${!insumo.ativo ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{insumo.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{insumo.unidadeMedida}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${
                      insumo.estoqueAtual <= insumo.estoqueMinimo
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}>
                      {insumo.estoqueAtual}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{insumo.estoqueMinimo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {insumo.valorUnitario != null
                      ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      !insumo.ativo
                        ? "bg-gray-100 text-gray-500"
                        : insumo.estoqueAtual <= insumo.estoqueMinimo
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {!insumo.ativo ? "INATIVO" : insumo.estoqueAtual <= insumo.estoqueMinimo ? "CRÍTICO" : "ATIVO"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/insumos/editar/${insumo.id}`}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </Link>
                      {insumo.ativo ? (
                        <button
                          onClick={() => handleAltStatus(insumo)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Inativar Insumo"
                        >
                          <PackageX size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAltStatus(insumo)}
                          className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Reativar Insumo"
                        >
                          <PackageCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {insumosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    Nenhum insumo encontrado.
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

export default ListInsumos;