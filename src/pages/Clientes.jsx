// src/pages/ListaClientes.jsx
import React, { useState, useEffect } from 'react';
import clienteService from '../services/clienteService';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        clienteService.getAll()
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(e => {
                console.error("Erro ao buscar clientes: ", e);
                setError("Falha ao carregar dados.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-400">Carregando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-blue">Lista de Clientes</h1>
            
            <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CPF/CNPJ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Telefone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {clientes.map(cliente => (
                            <tr key={cliente.id} className="hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cliente.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.cpfCnpj}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.telefone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Clientes;