import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clienteService from "../services/clienteService";
import { Search, Eye, Plus, Pencil, Trash2, Ban } from "lucide-react";

function ListClientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleInativar = async (id, nome) => {
    if (window.confirm(`Deseja realmente inativar o cliente ${nome}?`)) {
      try {
        await clienteService.partialUpdate(id, { ativo: false });
        alert("Cliente inativado com sucesso!");
        carregarClientes();
      } catch (error) {
        console.error(error);
        alert("Erro ao inativar cliente.");
      }
    }
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.cpfCnpj.includes(busca)
  );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Carregando dados...</div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          Gerenciamento de Clientes
        </h1>
        <Link
          to="/clientes/novo"
          className="bg-green hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Cliente
        </Link>
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Barra de Filtros */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou documento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-bold text-gray-800">
              {clientesFiltrados.length}
            </span>{" "}
            clientes
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Cliente</th>
                <th className="px-6 py-4 border-b">Documento</th>
                <th className="px-6 py-4 border-b">Contato</th>
                <th className="px-6 py-4 border-b">Localização</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientesFiltrados.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {cliente.nome}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: #{cliente.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cliente.cpfCnpj}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {cliente.telefone}
                    </div>
                    <div className="text-xs text-gray-500">{cliente.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cliente.endereco
                      ? `${cliente.endereco.cidade}/${cliente.endereco.estado}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cliente.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cliente.ativo ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Botão EDITAR */}
                      <Link
                        to={`/clientes/editar/${cliente.id}`}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* Botão SOFT DELETE (Inativar) */}
                      <button
                        onClick={() => handleInativar(cliente.id, cliente.nome)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                        title="Inativar Cliente"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Nenhum cliente encontrado.
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

export default ListClientes;
