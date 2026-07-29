import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clienteService from "../../services/clienteService";
import ModalClientes from "../../components/modals/ModalClientes";
import { formatarCep, formatarDoc, formatarTelefone } from "../../utils/formatters";
import { Search, Eye, Plus, Pencil, UserX, UserCheck } from "lucide-react";

function ListClientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [exibirInativos, setExibirInativos] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = () => {
    clienteService
      .getAll()
      .then((response) => {
        setClientes(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Erro ao buscar:", e);
        setLoading(false);
      });
  };

  const handleAltStatus = async (cliente) => {
    const novoStatus = !cliente.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    if (window.confirm(`Deseja realmente ${acao} o cliente ${cliente.nome}?`)) {
      try {
        if (novoStatus) {
          await clienteService.editar(cliente.id, { ativo: true }); // reativar
        } else {
          await clienteService.deletar(cliente.id); // inativar
        }
        alert(novoStatus ? "Cliente ativado com sucesso!" : "Cliente inativado com sucesso!");
        carregarClientes();
      } catch (error) {
        console.error(error);
        alert("Erro ao alterar status do cliente.");
      }
    }
  };

  const abrirModal = (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setClienteSelecionado(null);
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const matchBusca =
      cliente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.cpfCnpj.includes(busca);
    const matchAtivo = exibirInativos ? !cliente.ativo : cliente.ativo;
    return matchBusca && matchAtivo;
  });

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gerenciamento de Clientes</h1>
        <Link
          to="/clientes/novo"
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou documento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setExibirInativos(!exibirInativos)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            >
              {exibirInativos ? "Exibir Ativos" : "Exibir Inativos"}
            </button>
            <div className="text-sm text-gray-500">
              Total: <span className="font-bold text-gray-800">{clientesFiltrados.length}</span> clientes
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[68vh]"> 
          <table className="w-full text-left border-collapse relative">
            
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider text-center">
                <th className="px-6 py-4 border-b">Cliente</th>
                <th className="px-6 py-4 border-b">Documento</th>
                <th className="px-6 py-4 border-b">Contato</th>
                <th className="px-6 py-4 border-b">CEP</th>
                {/* <th className="px-6 py-4 border-b">Localização</th> */}
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 max-w-[280px] truncate">{cliente.nome}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap text-center">{formatarDoc(cliente.cpfCnpj)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 text-center">{formatarTelefone(cliente.telefone)}</div>
                    <div className="text-xs text-gray-500 text-center">{cliente.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap text-center">{formatarCep(cliente.endereco.cep)}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {cliente.endereco ? `${cliente.endereco.cidade}/${cliente.endereco.estado}` : "-"}
                  </td> */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirModal(cliente)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100 cursor-pointer"
                        title="Ver Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      <Link
                        to={`/clientes/editar/${cliente.id}`}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      {cliente.ativo ? (
                        <button
                          onClick={() => handleAltStatus(cliente)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Inativar Cliente"
                        >
                          <UserX size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAltStatus(cliente)}
                          className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Reativar Cliente"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalClientes isOpen={modalAberto} onClose={fecharModal} cliente={clienteSelecionado} />
    </div>
  );
}

export default ListClientes;