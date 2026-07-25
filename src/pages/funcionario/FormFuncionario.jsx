import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import funcionarioService from "../../services/funcionarioService";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { maskDoc, maskTelefone } from "../../utils/masks";
import { validarNome, validarEmail, validarDocumento, validarTelefone } from "../../utils/validators";

function FormFuncionario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cargo: "FUNCIONARIO",
  });

  useEffect(() => {
    if (id) {
      funcionarioService
        .getById(id)
        .then((res) => {
          const dados = res.data;
          const dadosFormatados = {
            ...dados,
            cpf: maskDoc(dados.cpf || ""),
            telefone: maskTelefone(dados.telefone || ""),
          };
          setFormData(dadosFormatados);
          setOriginalData(dadosFormatados);
        })
        .catch(() => toast.error("Erro ao carregar dados do funcionário."));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "cpf") {
      finalValue = maskDoc(value);
    } else if (name === "nome") {
      finalValue = value.replace(/[0-9]/g, "");
    } else if (name === "telefone") {
      finalValue = maskTelefone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    const erroNome = validarNome(formData.nome);
    if (erroNome) newErrors.nome = erroNome;

    const erroEmail = validarEmail(formData.email);
    if (erroEmail) newErrors.email = erroEmail;

    if (formData.cpf) {
      const erroCpf = validarDocumento(formData.cpf);
      if (erroCpf) newErrors.cpf = erroCpf;
    }

    if (formData.telefone) {
      const erroTel = validarTelefone(formData.telefone);
      if (erroTel) newErrors.telefone = erroTel;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning("Verifique os campos em vermelho.");
      return;
    }
    setLoading(true);

    const dadosLimpos = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ""),
      telefone: formData.telefone.replace(/\D/g, ""),
    };

    try {
      if (id) {
        await funcionarioService.editar(id, {
          nome: dadosLimpos.nome,
          email: dadosLimpos.email,
          cpf: dadosLimpos.cpf,
          telefone: dadosLimpos.telefone,
        });
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        const res = await funcionarioService.criar(dadosLimpos);
        toast.success(res.data);
        //toast.success("Funcionário cadastrado com sucesso! A senha temporária foi enviada no e-mail cadastrado.");
      }
      navigate("/funcionarios");
    } catch (error) {
      toast.error(error.response?.data || "Erro ao salvar funcionário.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCpf = (e) => {
    const erro = validarDocumento(e.target.value);
    if (erro) setErrors((prev) => ({ ...prev, cpf: erro }));
  };

  const handleValidarNome = (e) => {
    const erro = validarNome(e.target.value);
    if (erro) setErrors((prev) => ({ ...prev, nome: erro }));
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-2 text-dark-gray bg-white border rounded-md focus:outline-none focus:ring-2 transition-all ";

    if (errors[fieldName]) {
      return base + "border-red-500 focus:ring-red-500 placeholder-red-300";
    }

    if (id && originalData && formData[fieldName] !== originalData[fieldName]) {
      return base + "border-blue border-2 focus:ring-blue bg-blue-50 text-blue font-medium";
    }

    return base + "border-gray-300 focus:ring-blue";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/funcionarios")}
          className="p-2 hover:bg-light-gray rounded-full transition-colors text-blue hover:text-blue-900 cursor-pointer"
          title="Voltar para lista"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {id ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        noValidate
      >
        {/* Dados Pessoais */}
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
                onBlur={handleValidarNome}
              />
              {errors.nome && (
                <span className="text-xs text-red-500 mt-1">{errors.nome}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                name="cpf"
                placeholder="000.000.000-00"
                className={getInputClass("cpf")}
                value={formData.cpf || ""}
                onChange={handleChange}
                onBlur={handleValidarCpf}
                maxLength={14}
              />
              {errors.cpf && (
                <span className="text-xs text-red-500 mt-1">{errors.cpf}</span>
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
                value={formData.telefone || ""}
                onChange={handleChange}
                maxLength={15}
              />
              {errors.telefone && (
                <span className="text-xs text-red-500 mt-1">{errors.telefone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Acesso */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Acesso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                name="email"
                type="email"
                placeholder="funcionario@email.com"
                className={getInputClass("email")}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1">{errors.email}</span>
              )}
            </div>
            {!id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <select
                  name="cargo"
                  className={getInputClass("cargo")}
                  value={formData.cargo}
                  onChange={handleChange}
                >
                  <option value="FUNCIONARIO">Funcionário</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
          </div>
          {!id && (
            <p className="text-xs text-gray-400 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              Uma senha temporária será gerada automaticamente e exibida após o cadastro.
            </p>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Salvando..." : id ? "Salvar Mudanças" : "Cadastrar Funcionário"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/funcionarios")}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormFuncionario;