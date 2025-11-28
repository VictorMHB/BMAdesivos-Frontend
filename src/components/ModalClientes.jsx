import React from 'react';
import { X, MapPin, Phone, Mail, FileText, User } from 'lucide-react';
import { formatarDoc, formatarTelefone, formatarCep } from '../utils/formatters';

export default function ModalClientes({ isOpen, onClose, cliente }) {
    if (!isOpen || !cliente) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                
                {/* Cabeçalho */}
                <div className="bg-blue p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-blue-300" />
                        Detalhes do Cliente
                    </h2>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Corpo */}
                <div className="p-6 space-y-6">
                    
                    {/* Identificação */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Nome Completo</label>
                            <p className="text-gray-900 font-medium text-lg">{cliente.nome}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Documento</label>
                            <p className="text-gray-900 font-medium flex items-center gap-2">
                                <FileText size={16} className="text-blue-500"/>
                                {formatarDoc(cliente.cpfCnpj)}
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100"/>

                    {/* Contatos */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Contatos</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <Mail className="text-blue-500" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500">E-mail</p>
                                    <p className="text-sm font-medium text-gray-800">{cliente.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <Phone className="text-green" size={20} />
                                        <div>
                                    <p className="text-xs text-gray-500">Telefone</p>
                                    <p className="text-sm font-medium text-gray-800">{formatarTelefone(cliente.telefone)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100"/>

                    {/* Endereço */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                            <MapPin size={14} /> Endereço
                        </label>
                        {cliente.endereco ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900">
                                <p><span className="font-semibold">Rua:</span> {cliente.endereco.rua}, {cliente.endereco.numero}</p>
                                <p><span className="font-semibold">Bairro:</span> {cliente.endereco.bairro}</p>
                                <p><span className="font-semibold">Cidade:</span> {cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                                <p><span className="font-semibold">CEP:</span> {formatarCep(cliente.endereco.cep)}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Endereço não cadastrado.</p>
                        )}
                    </div>
                </div>

                {/* Rodapé */}
                {/* <div className="bg-gray-50 p-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                        Fechar
                    </button>
                </div> */}

            </div>
        </div>
    );
}