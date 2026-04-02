import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adesivoService from "../../services/adesivoService";
import fichaTecnicaService from "../../services/fichaTecnicaService";
import ModalFichaTecnica from "../../components/modals/ModalFichaTecnica";
import { Search, Plus, Pencil, PackageX, PackageCheck, Eye } from "lucide-react";

function ListAdesivos() {
  const [adesivos, setAdesivos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [exibirInativos, setExibirInativos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [fichaAtual, setFichaAtual] = useState([]);
  const [adesivoSelecionado, setAdesivoSelecionado] = useState(null);

  useEffect(() => {
    carregarAdesivos();
  }, []);

  const carregarAdesivos = () => {
    adesivoService.getAll().then((response) => {
      setAdesivos(response.data);
      setLoading(false);
    }).catch((e) => {
      console.error("Erro ao buscar adesivos:", e);
      setLoading(false);
    });
  };

  const handleAbrirFicha = async (adesivo) => {
    try {
      const res = await fichaTecnicaService.getAll(adesivo.id);
      setFichaAtual(res.data);
      setAdesivoSelecionado(adesivo);
      setModalAberto(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAltStatus = async (adesivo) => {
    const novoStatus = !adesivo.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    if (window.confirm(`Deseja realmente ${acao} o adesivo ${adesivo.nome}?`)) {
      try {
        if (novoStatus) {
          await adesivoService.editar(adesivo.id, { ativo: true });
        } else {
          await adesivoService.deletar(adesivo.id);
        }
        alert(`Adesivo ${novoStatus ? "ativado" : "inativado"} com sucesso!`);
        carregarAdesivos();
      } catch (error) {
        console.error(error);
        alert("Erro ao alterar status do adesivo.");
      }
    }
  };

  const formatarTipo = (tipo) => {
    const tipos = {
      ETIQUETA_METALICA: "Etiqueta Metálica",
      ADESIVO_COMUM: "Adesivo Comum",
      ADESIVO_RESINADO: "Adesivo Resinado",
    };
    return tipos[tipo] || tipo;
  };

  const adesivosFiltrados = adesivos.filter((a) => {
    const matchBusca = a.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchAtivo = exibirInativos ? !a.ativo : a.ativo;
    return matchBusca && matchAtivo;
  });

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gerenciamento de Adesivos</h1>
        <Link
          to="/adesivos/novo"
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Adesivo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setExibirInativos(!exibirInativos)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            >
              {exibirInativos ? "Exibindo Inativos" : "Exibir Inativos"}
            </button>
            <div className="text-sm text-gray-500">
              Total: <span className="font-bold text-gray-800">{adesivosFiltrados.length}</span> adesivos
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[68vh]"> 
          <table className="w-full text-left border-collapse relative">
            
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Nome</th>
                <th className="px-6 py-4 border-b">Tipo</th>
                <th className="px-6 py-4 border-b">Dimensões</th>
                <th className="px-6 py-4 border-b">Preço de Venda</th>
                <th className="px-6 py-4 border-b">Cliente</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adesivosFiltrados.map((adesivo) => (
                <tr key={adesivo.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{adesivo.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatarTipo(adesivo.tipoAdesivo)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {adesivo.comprimento && adesivo.altura
                      ? `${adesivo.comprimento} x ${adesivo.altura} cm`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {adesivo.valorUnitario != null
                      ? `R$ ${adesivo.valorUnitario.toFixed(2).replace(".", ",")}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {adesivo.cliente?.nome || "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAbrirFicha(adesivo)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100 cursor-pointer"
                        title="Ver Ficha Técnica"
                      >
                        <Eye size={18} />
                      </button>
                      <Link
                        to={`/adesivos/editar/${adesivo.id}`}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </Link>
                      {adesivo.ativo ? (
                        <button
                          onClick={() => handleAltStatus(adesivo)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Inativar Adesivo"
                        >
                          <PackageX size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAltStatus(adesivo)}
                          className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Reativar Adesivo"
                        >
                          <PackageCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {adesivosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    Nenhum adesivo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalFichaTecnica
        isOpen={modalAberto}
        onClose={() => { setModalAberto(false); setAdesivoSelecionado(null); setFichaAtual([]); }}
        adesivo={adesivoSelecionado}
        itens={fichaAtual}
      />
    </div>
  );
}

export default ListAdesivos;