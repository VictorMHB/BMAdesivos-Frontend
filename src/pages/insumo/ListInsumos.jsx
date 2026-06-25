import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import insumoService from "../../services/insumoService";
import ModalInsumos from "../../components/modals/ModalInsumos";
import { Search, Plus, Pencil, PackageX, PackageCheck, Eye } from "lucide-react";

function ListInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [exibirInativos, setExibirInativos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);

  useEffect(() => {
    carregarInsumos();
  }, []);

  const carregarInsumos = () => {
    insumoService.getAll().then((response) => {
      setInsumos(response.data);
      setLoading(false);
    }).catch((e) => {
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
          await insumoService.editar(insumo.id, { ativo: true });
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

  const abrirModal = (insumo) => {
    setInsumoSelecionado(insumo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setInsumoSelecionado(null);
  };

  const formatarTipo = (tipo) => {
    const tipos = { SUBSTRATO: "Substrato", TINTA: "Tinta", RESINA: "Resina", OUTRO: "Outro" };
    return tipos[tipo] || tipo;
  };

  const formatarTamanhoEmbalagem = (tamanho) => {
    const tamanhos = { ML_750: "750mL", L_1: "1L" };
    return tamanhos[tamanho] || tamanho;
  };

  const formatarNumero = (valor, casasDecimais = 2) => {
  if (valor == null) return "—";
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
};

  const renderValorTotal = (insumo) => {
    if (insumo.valorUnitario != null && insumo.estoqueAtual != null) {
      return `R$ ${(insumo.valorUnitario * insumo.estoqueAtual).toFixed(2).replace(".", ",")}`;
    }
    return "—";
  };

  const renderBadgeTipo = (tipo) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
      tipo === "SUBSTRATO" ? "bg-blue-100 text-blue" :
      tipo === "TINTA" ? "bg-purple-100 text-purple-700" :
      tipo === "RESINA" ? "bg-yellow-100 text-yellow-700" :
      "bg-gray-100 text-gray-600"
    }`}>
      {formatarTipo(tipo)}
    </span>
  );

  const renderAcoes = (insumo) => (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => abrirModal(insumo)}
        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100 cursor-pointer"
        title="Ver Detalhes"
      >
        <Eye size={18} />
      </button>
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
          title="Inativar"
        >
          <PackageX size={18} />
        </button>
      ) : (
        <button
          onClick={() => handleAltStatus(insumo)}
          className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
          title="Reativar"
        >
          <PackageCheck size={18} />
        </button>
      )}
    </div>
  );

  const insumosFiltrados = insumos.filter((i) => {
    const matchBusca = i.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = tipoFiltro === "TODOS" || i.tipoInsumo === tipoFiltro;
    const matchAtivo = exibirInativos ? !i.ativo : i.ativo;
    return matchBusca && matchTipo && matchAtivo;
  });

  const renderTabela = () => {
    if (tipoFiltro === "SUBSTRATO") {
      return (
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider">
              <th className="px-6 py-4 border-b">Nome</th>
              <th className="px-6 py-4 border-b">Largura (m)</th>
              <th className="px-6 py-4 border-b">Comprimento (m)</th>
              <th className="px-6 py-4 border-b">m²</th>
              <th className="px-6 py-4 border-b">Estoque (m²)</th>
              <th className="px-6 py-4 border-b">Valor Unit.</th>
              <th className="px-6 py-4 border-b">Valor Total</th>
              <th className="px-6 py-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {insumosFiltrados.map((insumo) => (
              <tr key={insumo.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-[280px] truncate">{insumo.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.largura) ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.comprimento) ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.metrosQuadrados) ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.estoqueAtual)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {insumo.valorUnitario != null ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}` : "—"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{renderValorTotal(insumo)}</td>
                <td className="px-6 py-4 text-center">{renderAcoes(insumo)}</td>
              </tr>
            ))}
            {insumosFiltrados.length === 0 && (
              <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-400">Nenhum substrato encontrado.</td></tr>
            )}
          </tbody>
        </table>
      );
    }

    if (tipoFiltro === "TINTA") {
      return (
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider">
              <th className="px-6 py-4 border-b">Nome</th>
              <th className="px-6 py-4 border-b">Cor</th>
              <th className="px-6 py-4 border-b">Embalagem</th>
              <th className="px-6 py-4 border-b">Estoque (un)</th>
              <th className="px-6 py-4 border-b">Valor Unit.</th>
              <th className="px-6 py-4 border-b">Valor Total</th>
              <th className="px-6 py-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {insumosFiltrados.map((insumo) => (
              <tr key={insumo.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{insumo.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{insumo.cor || "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {insumo.tamanhoEmbalagem ? formatarTamanhoEmbalagem(insumo.tamanhoEmbalagem) : "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.estoqueAtual)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {insumo.valorUnitario != null ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}` : "—"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{renderValorTotal(insumo)}</td>
                <td className="px-6 py-4 text-center">{renderAcoes(insumo)}</td>
              </tr>
            ))}
            {insumosFiltrados.length === 0 && (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">Nenhuma tinta encontrada.</td></tr>
            )}
          </tbody>
        </table>
      );
    }

    if (tipoFiltro === "RESINA") {
      return (
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider">
              <th className="px-6 py-4 border-b">Nome</th>
              <th className="px-6 py-4 border-b">Estoque (kg)</th>
              <th className="px-6 py-4 border-b">Valor Unit. (R$/kg)</th>
              <th className="px-6 py-4 border-b">Valor Total</th>
              <th className="px-6 py-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {insumosFiltrados.map((insumo) => (
              <tr key={insumo.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{insumo.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatarNumero(insumo.estoqueAtual)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {insumo.valorUnitario != null ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}` : "—"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{renderValorTotal(insumo)}</td>
                <td className="px-6 py-4 text-center">{renderAcoes(insumo)}</td>
              </tr>
            ))}
            {insumosFiltrados.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Nenhuma resina encontrada.</td></tr>
            )}
          </tbody>
        </table>
      );
    }

    // TODOS
    return (
      <table className="w-full text-left border-collapse relative">
        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
          <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider">
            <th className="px-6 py-4 border-b">Nome</th>
            <th className="px-6 py-4 border-b">Tipo</th>
            <th className="px-6 py-4 border-b">Estoque</th>
            <th className="px-6 py-4 border-b">Valor Unit.</th>
            <th className="px-6 py-4 border-b">Valor Total</th>
            <th className="px-6 py-4 border-b text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {insumosFiltrados.map((insumo) => (
            <tr key={insumo.id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{insumo.nome}</td>
              <td className="px-6 py-4">{renderBadgeTipo(insumo.tipoInsumo)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatarNumero(insumo.estoqueAtual)}
                {insumo.tipoInsumo === "SUBSTRATO" && " m²"}
                {insumo.tipoInsumo === "TINTA" && " un"}
                {insumo.tipoInsumo === "RESINA" && " kg"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {insumo.valorUnitario != null ? `R$ ${insumo.valorUnitario.toFixed(2).replace(".", ",")}` : "—"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{renderValorTotal(insumo)}</td>
              <td className="px-6 py-4 text-center">{renderAcoes(insumo)}</td>
            </tr>
          ))}
          {insumosFiltrados.length === 0 && (
            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Nenhum insumo encontrado.</td></tr>
          )}
        </tbody>
      </table>
    );
  };

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
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent bg-white"
            >
              <option value="TODOS">Todos</option>
              <option value="SUBSTRATO">Substrato</option>
              <option value="TINTA">Tinta</option>
              <option value="RESINA">Resina</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setExibirInativos(!exibirInativos)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            >
              {exibirInativos ? "Exibir Ativos" : "Exibir Inativos"}
            </button>
            <div className="text-sm text-gray-500">
              Total: <span className="font-bold text-gray-800">{insumosFiltrados.length}</span> insumos
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[68vh]">
          {renderTabela()}
        </div>
      </div>

      <ModalInsumos isOpen={modalAberto} onClose={fecharModal} insumo={insumoSelecionado} />
    </div>
  );
}

export default ListInsumos;