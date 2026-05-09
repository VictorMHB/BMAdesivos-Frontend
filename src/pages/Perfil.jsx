import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatarCargo } from "../utils/formatters";
import api from '../services/api';
import { toast } from 'react-toastify';
import {
    User, Mail, Phone, Lock, ChevronDown, Save, AlertTriangle, Briefcase
} from 'lucide-react';

const Perfil = () => {
    const navigate = useNavigate();

    const [nome] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
    const [cargo] = useState(localStorage.getItem('usuarioCargo') || 'FUNCIONARIO');
    const [email] = useState(localStorage.getItem('usuarioEmail') || '');
    const [telefone] = useState(localStorage.getItem('usuarioTelefone') || '');
    const userId = localStorage.getItem('usuarioId');
    const requerTrocarSenha = localStorage.getItem('requerTrocarSenha') === 'true';

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [senhaAberta, setSenhaAberta] = useState(requerTrocarSenha);

    const iniciais = nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('');

    const handleAlterarSenha = async (e) => {
        e.preventDefault();

        if (novaSenha === senhaAtual) {
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
                novaSenha,
            });
            localStorage.setItem('requerTrocarSenha', 'false');
            toast.success("Senha alterada com sucesso!");
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

                {/* Header com avatar */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-medium flex-shrink-0">
                        {iniciais}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 leading-tight">{nome}</h2>
                        <span className="text-sm text-gray-400">{formatarCargo(cargo)}</span>
                    </div>
                </div>

                {/* Aviso senha temporária */}
                {requerTrocarSenha && (
                    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700">
                            Você está usando uma <strong>senha temporária</strong>. Altere-a para liberar o acesso completo ao sistema.
                        </p>
                    </div>
                )}

                {/* Dados pessoais */}
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
                    Dados pessoais
                </p>
                <div className="grid grid-cols-2 gap-5 mb-8">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <User size={13} /> Nome
                        </span>
                        <span className="text-sm font-medium text-gray-800">{nome}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Briefcase size={13} /> Cargo
                        </span>
                        <span className="text-sm font-medium text-gray-800">{formatarCargo(cargo)}</span>
                    </div>
                    {email && (
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Mail size={13} /> Email
                            </span>
                            <span className="text-sm font-medium text-gray-800 truncate">{email}</span>
                        </div>
                    )}
                    {telefone && (
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Phone size={13} /> Telefone
                            </span>
                            <span className="text-sm font-medium text-gray-800">{telefone}</span>
                        </div>
                    )}
                </div>

                {/* Accordion — Alterar senha */}
                <div className="border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setSenhaAberta((v) => !v)}
                        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
                    >
                        <span className="flex items-center gap-2.5 text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                            <Lock size={15} className="text-gray-400" />
                            Alterar senha
                        </span>
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-300 ${senhaAberta ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${senhaAberta ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleAlterarSenha} className="pb-2 space-y-4" noValidate>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Senha atual</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Nova senha</label>
                                <input
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Confirmar nova senha</label>
                                <input
                                    type="password"
                                    placeholder="Repita a nova senha"
                                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
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
                            <p className="text-xs text-gray-400 text-center pb-2">
                                A senha deve conter letras maiúsculas, minúsculas e números.
                            </p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Perfil;