import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import funcionarioService from "../../services/funcionarioService";
import { formatarDoc, formatarCargo, formatarTelefone } from "../../utils/formatters";
import { Search, Plus, Pencil, UserX, UserCheck } from "lucide-react";

function ListFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [exibirInativos, setExibirInativos] = useState(false);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = () => {
    funcionarioService
      .getAll()
      .then((response) => {
        setFuncionarios(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Erro ao buscar funcionários:", e);
        setLoading(false);
      });
  };

  const handleAltStatus = async (funcionario) => {
    const novoStatus = !funcionario.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    if (window.confirm(`Deseja realmente ${acao} o funcionário ${funcionario.nome}?`)) {
      try {
        await funcionarioService.editar(funcionario.id, { ativo: novoStatus });
        alert(`Funcionário ${novoStatus ? "ativado" : "inativado"} com sucesso!`);
        carregarFuncionarios();
      } catch (error) {
        console.error(error);
        alert("Erro ao alterar status do funcionário.");
      }
    }
  };

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const matchBusca =
      f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      f.email?.toLowerCase().includes(busca.toLowerCase());
    const matchAtivo = exibirInativos ? !f.ativo : f.ativo;
    return matchBusca && matchAtivo;
  });

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gerenciamento de Funcionários</h1>
        <Link
          to="/funcionarios/novo"
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Funcionário
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
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
              Total: <span className="font-bold text-gray-800">{funcionariosFiltrados.length}</span> funcionários
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[68vh]"> 
          <table className="w-full text-left border-collapse relative">
            
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider text-center">
                <th className="px-6 py-4 border-b">Nome</th>
                <th className="px-6 py-4 border-b">Email</th>
                <th className="px-6 py-4 border-b">CPF</th>
                <th className="px-6 py-4 border-b">Telefone</th>
                <th className="px-6 py-4 border-b">Cargo</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {funcionariosFiltrados.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[280px] truncate">{funcionario.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{funcionario.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {funcionario.cpf ? formatarDoc(funcionario.cpf) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {funcionario.telefone ? formatarTelefone(funcionario.telefone) : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                      funcionario.cargo === "ADMIN"
                        ? "bg-light-orange text-orange"
                        : "bg-light-blue text-blue"
                    }`}>
                      {formatarCargo(funcionario.cargo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/funcionarios/editar/${funcionario.id}`}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </Link>
                      {funcionario.ativo ? (
                        <button
                          onClick={() => handleAltStatus(funcionario)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Inativar Funcionário"
                        >
                          <UserX size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAltStatus(funcionario)}
                          className="text-green hover:bg-green-50 p-2 rounded-full transition-colors cursor-pointer"
                          title="Reativar Funcionário"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {funcionariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    Nenhum funcionário encontrado.
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

export default ListFuncionarios;