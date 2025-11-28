import { cpf, cnpj } from 'cpf-cnpj-validator';

export const validarNome = (nome) => {
    if (!nome || !nome.trim()) return "Nome é obrigatório.";
    return null;
};


export const validarDocumento = (doc) => {
    if (!doc) return "Documento é obrigatório.";
    
    const limpo = doc.replace(/\D/g, '');

    if (limpo.length <= 11) {
        return cpf.isValid(limpo) ? null : "CPF inválido.";
    } else {
        return cnpj.isValid(limpo) ? null : "CNPJ inválido.";
    }
};

export const validarEmail = (email) => {
    if (email && !email.includes('@')) return "E-mail inválido.";
    return null;
};

export const validarTelefone = (tel) => {
    const limpo = tel.replace(/\D/g, '');
    if (limpo.length < 10) return "Telefone inválido.";
    return null;
};

export const validarCep = (cep) => {
    const limpo = cep.replace(/\D/g, '');
    if (limpo && limpo.length !== 8) return "CEP inválido.";
    return null;
};