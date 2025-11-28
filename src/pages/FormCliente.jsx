import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteService from "../services/clienteService";
import { maskDoc, maskCep, maskTelefone } from "../utils/masks";
import { ArrowLeft } from "lucide-react";
import { estadosBrasileiros } from "../utils/estados";

function FormCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  useEffect(() => {
    if (id) {
      clienteService
        .getById(id)
        .then((response) => {
          const dados = response.data;
          
          setFormData({
            ...dados,
            cpfCnpj: maskDoc(dados.cpfCnpj || ""),
            telefone: maskTelefone(dados.telefone || ""),
            endereco: {
                ...dados.endereco,
                cep: maskCep(dados.endereco?.cep || "")
            }
          });
        })
        .catch((error) => {
          console.error("Erro ao carregar cliente", error);
          alert("Erro ao carregar dados do cliente.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === 'cpfCnpj') {
      finalValue = maskDoc(value);
    } else if (name === 'telefone') {
      finalValue = maskTelefone(value);
    } else if (name === 'cep') {
      finalValue = maskCep(value);
    } 

    if (["rua", "numero", "bairro", "cidade", "estado", "cep"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: finalValue },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";

    const docLimpo = formData.cpfCnpj.replace(/\D/g, "");
    if (docLimpo.length !== 11 && docLimpo.length !== 14) {
      newErrors.cpfCnpj = "CPF (11) ou CNPJ (14) inválido.";
    }

    const telLimpo = formData.telefone.replace(/\D/g, "");
    if (telLimpo.length < 10) {
      newErrors.telefone = "Telefone inválido.";
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Formato de e-mail inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (id) {
        await clienteService.update(formData);
        alert("Cliente atualizado com sucesso!");
      } else {
        await clienteService.create(formData);
        alert("Cliente cadastrado com sucesso!");
      }
      navigate("/clientes");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-2 text-dark-gray bg-light-gray border rounded-md focus:outline-none focus:ring-2 transition-all ";

    if (errors[fieldName]) {
      return base + "border-red-500 focus:ring-red-500 placeholder-red-300";
    }

    return base + "border-ice focus:gray";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/clientes")}
          className="p-2 hover:bg-light-gray rounded-full transition-colors text-blue hover:text-blue-900 cursor-pointer"
          title="Voltar para lista"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {id ? "Editar Cliente" : "Cadastrar Cliente"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        noValidate
      >
        {/* Seção 1: Dados Pessoais */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                name="nome"
                placeholder="Digite o nome completo"
                className={getInputClass("nome")}
                value={formData.nome}
                onChange={handleChange}
              />
              {errors.nome && (
                <span className="text-xs text-red-500 mt-1">{errors.nome}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF/CNPJ *
              </label>
              <input
                name="cpfCnpj"
                placeholder="000.000.000-00"
                className={getInputClass("cpfCnpj")}
                value={formData.cpfCnpj}
                onChange={handleChange}
                maxLength={18}
              />
              {errors.cpfCnpj && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.cpfCnpj}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção 2: Contato */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                name="email"
                type="email"
                placeholder="cliente@email.com"
                className={getInputClass("email")}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.email}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                name="telefone"
                placeholder="(43) 99999-9999"
                className={getInputClass("telefone")}
                value={formData.telefone}
                onChange={handleChange}
                maxLength={15}
              />
              {errors.telefone && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.telefone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção 3: Endereço */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Endereço
          </h2>

          {/* Linha 1 do Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua
              </label>
              <input
                name="rua"
                placeholder="Rua Exemplo"
                className={getInputClass("rua")}
                value={formData.endereco.rua}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                name="numero"
                placeholder="000"
                className={getInputClass("numero")}
                value={formData.endereco.numero}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Linha 2 do Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                name="bairro"
                placeholder="Centro"
                className={getInputClass("bairro")}
                value={formData.endereco.bairro}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                name="cidade"
                placeholder="Londrina"
                className={getInputClass("cidade")}
                value={formData.endereco.cidade}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  name="cep"
                  placeholder="00000-000"
                  maxLength={9}
                  className={getInputClass("cep")}
                  value={formData.endereco.cep}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select 
                  name="estado"
                  className={`${getInputClass('estado')} ${!formData.endereco.estado ? 'text-gray!' : ''}`}
                  value={formData.endereco.estado}
                  onChange={handleChange}
                >

                  <option value="">Selecione</option>
                  {estadosBrasileiros.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>
                      {uf.sigla}
                    </option>
                  ))}
                </select>
                
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Salvando..." : (id ? "Salvar Mudanças" : "Cadastrar Cliente")}
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                nome: "",
                cpfCnpj: "",
                email: "",
                telefone: "",
                endereco: {
                  rua: "",
                  numero: "",
                  bairro: "",
                  cidade: "",
                  estado: "",
                  cep: "",
                },
              })
            }
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Limpar Campos
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCliente;
