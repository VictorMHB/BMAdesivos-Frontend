import React, { useState } from 'react';
import { Key, Save, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatarCargo } from "../utils/formatters";
import api from '../services/api';
import { toast } from 'react-toastify';

const Perfil = () => {
    const navigate = useNavigate();

    const [nome] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
    const [cargo] = useState(localStorage.getItem('usuarioCargo') || 'FUNCIONARIO');
    const userId = localStorage.getItem('usuarioId');
    const requerTrocarSenha = localStorage.getItem('requerTrocarSenha') === 'true';

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAlterarSenha = async (e) => {
        e.preventDefault();

        if (novaSenha == senhaAtual) {
            toast.error("A nova senha deve ser diferente da senha atual.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            toast.error("A nova senha e a confirmação não coincidem.");
            return;
        }

        if (novaSenha.length < 8) {
            toast.error("A nova senha deve ter no mínimo 8 caracteres.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/funcionarios/${userId}/alterar-senha`, {
                senhaAtual,
                novaSenha
            });

            localStorage.setItem('requerTrocarSenha', 'false');
            toast.success("Senha alterada com sucesso! Acesso liberado.");

            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            toast.error(error.response?.data || "Senha atual incorreta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <User className="text-blue" size={28} />
                <h1 className="text-2xl font-bold text-blue-900">Meu Perfil</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {/* Dados do funcionário */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
                        Dados Pessoais
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Nome</p>
                            <p className="text-gray-800 font-semibold">{nome}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Cargo</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                cargo === 'ADMIN'
                                    ? 'bg-light-orange text-orange'
                                    : 'bg-light-blue text-blue'
                            }`}>
                                {formatarCargo(cargo)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Aviso de senha temporária */}
                {requerTrocarSenha && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                        <p className="text-amber-700 text-sm">
                            <strong>Atenção:</strong> Você está usando uma senha temporária.
                            Altere-a para desbloquear as outras funções do sistema.
                        </p>
                    </div>
                )}

                {/* Formulário de troca de senha */}
                <form onSubmit={handleAlterarSenha} className="space-y-5" noValidate>
                    <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2 flex items-center gap-2">
                         Alterar Senha
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha Atual
                        </label>
                        <input
                            type="password"
                            required
                            // placeholder="Senha atual"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nova Senha
                        </label>
                        <input
                            type="password"
                            required
                            // placeholder="Nova senha"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Nova Senha
                        </label>
                        <input
                            type="password"
                            required
                            // placeholder="Confirmar senha"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full bg-green hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
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