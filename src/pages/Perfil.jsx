import React, { useState } from 'react';
import { Key, Save, User } from 'lucide-react';
import api from '../services/api';

const Perfil = () => {
    // Recupera dados básicos do localStorage salvos no Login
    const [nome] = useState(localStorage.getItem('user_nome') || 'Usuário');
    const [cargo] = useState(localStorage.getItem('user_cargo') || 'FUNCIONARIO');
    const userId = localStorage.getItem('user_id');

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAlterarSenha = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Chamada ao endpoint que criamos no backend
            await api.patch(`/funcionarios/${userId}/alterar-senha`, {
                senhaAtual,
                novaSenha
            });

            // Atualiza o status de bloqueio no navegador
            localStorage.setItem('requerTrocaSenha', 'false');
            
            alert("Senha alterada com sucesso! Seu acesso está liberado.");
            window.location.href = '/dashboard'; // Redireciona para o início
        } catch (error) {
            alert(error.response?.data || "Erro ao alterar a senha. Verifique a senha atual.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-blue-600" /> Meu Perfil
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                {/* Informações básicas do Funcionário */}
                <div className="mb-8 border-b pb-4">
                    <p className="text-sm text-gray-500 uppercase font-bold">Nome</p>
                    <p className="text-lg text-gray-800">{nome}</p>
                    
                    <p className="text-sm text-gray-500 uppercase font-bold mt-4">Cargo</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                        {cargo}
                    </span>
                </div>

                {/* Formulário de Troca de Senha (SenhaUpdateDTO) */}
                <form onSubmit={handleAlterarSenha} className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Key size={20} /> Alterar Senha
                    </h2>
                    
                    {localStorage.getItem('requerTrocaSenha') === 'true' && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                            <p className="text-amber-700 text-sm">
                                <strong>Atenção:</strong> Você está usando uma senha temporária. 
                                Altere-a para desbloquear as outras funções do sistema.
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            placeholder="Mínimo 8 caracteres"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        <Save size={18} />
                        {loading ? 'Salvando...' : 'Atualizar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Perfil;