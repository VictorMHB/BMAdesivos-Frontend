import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import insumoService from "../../services/insumoService";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { maskMoeda } from "../../utils/masks";

const TIPOS_INSUMO = [
  { value: "SUBSTRATO", label: "SUBSTRATO" },
  { value: "TINTA", label: "TINTA" },
  { value: "RESINA", label: "RESINA" },
];

const TAMANHOS_EMBALAGEM = [
  { value: "ML_750", label: "750mL" },
  { value: "L_1", label: "1L" },
];

const labelEstoque = {
  TINTA: "Estoque Atual (un)",
  RESINA: "Estoque Atual (kg)",
};

function FormInsumo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipoInsumo: "",
    estoqueAtual: "",
    valorUnitario: "",
    largura: "",
    comprimento: "",
    metrosQuadrados: "",
    quantidadeRolos: "",
    cor: "",
    tamanhoEmbalagem: "",
  });

  const metrosQuadradosCalculados =
    formData.largura && formData.comprimento
      ? (Number(formData.largura) * Number(formData.comprimento)).toFixed(2)
      : null;

  const totalM2 = (() => {
    const m2PorRolo = metrosQuadradosCalculados || formData.metrosQuadrados;
    if (m2PorRolo && formData.quantidadeRolos) {
      return (Number(m2PorRolo) * Number(formData.quantidadeRolos)).toFixed(2);
    }
    return null;
  })();

  useEffect(() => {
    if (id) {
      insumoService
        .getById(id)
        .then((res) => {
          const dados = res.data;
          const dadosFormatados = {
            nome: dados.nome || "",
            descricao: dados.descricao || "",
            tipoInsumo: dados.tipoInsumo || "",
            estoqueAtual: dados.estoqueAtual ?? "",
            valorUnitario: dados.valorUnitario != null
              ? maskMoeda(String(Math.round(dados.valorUnitario * 100)))
              : "",
            largura: dados.largura ?? "",
            comprimento: dados.comprimento ?? "",
            metrosQuadrados: dados.metrosQuadrados ?? "",
            quantidadeRolos: dados.quantidadeRolos ?? "",
            cor: dados.cor || "",
            tamanhoEmbalagem: dados.tamanhoEmbalagem || "",
          };
          setFormData(dadosFormatados);
          setOriginalData(dadosFormatados);
        })
        .catch(() => toast.error("Erro ao carregar dados do insumo."));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "valorUnitario") {
      finalValue = maskMoeda(value);
    }

    if (name === "tipoInsumo") {
      setFormData((prev) => ({
        ...prev,
        tipoInsumo: value,
        largura: "",
        comprimento: "",
        metrosQuadrados: "",
        quantidadeRolos: "",
        cor: "",
        tamanhoEmbalagem: "",
        estoqueAtual: "",
      }));
      if (errors.tipoInsumo) setErrors((prev) => ({ ...prev, tipoInsumo: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nome?.trim()) newErrors.nome = "Nome é obrigatório.";
    else if (formData.nome.trim().length < 3) newErrors.nome = "Nome deve ter no mínimo 3 caracteres.";

    if (!formData.tipoInsumo) newErrors.tipoInsumo = "Tipo do insumo é obrigatório.";

    if (formData.tipoInsumo !== "SUBSTRATO") {
      if (formData.estoqueAtual === "" || formData.estoqueAtual == null)
        newErrors.estoqueAtual = "Estoque atual é obrigatório.";
    }

    if (formData.tipoInsumo === "SUBSTRATO") {
      if (!formData.quantidadeRolos || Number(formData.quantidadeRolos) < 0)
        newErrors.quantidadeRolos = "Quantidade de rolos é obrigatória.";
      if (!metrosQuadradosCalculados && !formData.metrosQuadrados)
        newErrors.metrosQuadrados = "Informe as dimensões ou o m² diretamente.";
    }

    if (formData.tipoInsumo === "TINTA") {
      if (!formData.cor?.trim()) newErrors.cor = "Cor é obrigatória para tintas.";
      if (!formData.tamanhoEmbalagem) newErrors.tamanhoEmbalagem = "Tamanho da embalagem é obrigatório.";
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
      nome: formData.nome.trim(),
      descricao: formData.descricao?.trim() || null,
      tipoInsumo: formData.tipoInsumo,
      estoqueAtual: formData.estoqueAtual 
  ? Number(String(formData.estoqueAtual).replace(",", ".")) 
  : 0,
      valorUnitario: formData.valorUnitario
        ? Number(String(formData.valorUnitario).replace(/\./g, "").replace(",", "."))
        : null,
      largura: formData.tipoInsumo === "SUBSTRATO" && formData.largura ? Number(formData.largura) : null,
      comprimento: formData.tipoInsumo === "SUBSTRATO" && formData.comprimento ? Number(formData.comprimento) : null,
      metrosQuadrados: formData.tipoInsumo === "SUBSTRATO"
        ? metrosQuadradosCalculados ? Number(metrosQuadradosCalculados)
          : formData.metrosQuadrados ? Number(formData.metrosQuadrados) : null
        : null,
      quantidadeRolos: formData.tipoInsumo === "SUBSTRATO" && formData.quantidadeRolos
        ? Number(formData.quantidadeRolos)
        : null,
      cor: formData.tipoInsumo === "TINTA" ? formData.cor.trim() : null,
      tamanhoEmbalagem: formData.tipoInsumo === "TINTA" ? formData.tamanhoEmbalagem : null,
    };

    try {
      if (id) {
        await insumoService.editar(id, dadosLimpos);
        toast.success("Insumo atualizado com sucesso!");
      } else {
        await insumoService.criar(dadosLimpos);
        toast.success("Insumo cadastrado com sucesso!");
      }
      navigate("/insumos");
    } catch (error) {
      toast.error(error.response?.data || "Erro ao salvar insumo.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-2 text-dark-gray bg-white border rounded-md focus:outline-none focus:ring-2 transition-all ";

    if (errors[fieldName]) {
      return base + "border-red-500 focus:ring-red-500 placeholder-red-300";
    }

    if (id && originalData && String(formData[fieldName]) !== String(originalData[fieldName])) {
      return base + "border-blue border-2 focus:ring-blue bg-blue-50 text-blue font-medium";
    }

    return base + "border-gray-300 focus:ring-blue";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/insumos")}
          className="p-2 hover:bg-light-gray rounded-full transition-colors text-blue hover:text-blue-900 cursor-pointer"
          title="Voltar para lista"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {id ? "Editar Insumo" : "Cadastrar Insumo"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        noValidate
      >
        {/* Dados Gerais */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Dados Gerais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                name="nome"
                placeholder="Ex: Vinil Branco Fosco"
                className={getInputClass("nome")}
                value={formData.nome}
                onChange={handleChange}
              />
              {errors.nome && <span className="text-xs text-red-500 mt-1">{errors.nome}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do Insumo *</label>
              <select
                name="tipoInsumo"
                className={getInputClass("tipoInsumo")}
                value={formData.tipoInsumo}
                onChange={handleChange}
                disabled={!!id}
              >
                <option value="">Selecione</option>
                {TIPOS_INSUMO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
              {errors.tipoInsumo && <span className="text-xs text-red-500 mt-1">{errors.tipoInsumo}</span>}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="descricao"
              placeholder="Informações adicionais sobre o insumo..."
              rows={2}
              className={getInputClass("descricao")}
              value={formData.descricao}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Substrato */}
        {formData.tipoInsumo === "SUBSTRATO" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
              Dimensões do Rolo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Largura (m)</label>
                <input
                  name="largura"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 1.22"
                  className={getInputClass("largura")}
                  value={formData.largura}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (m)</label>
                <input
                  name="comprimento"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 50"
                  className={getInputClass("comprimento")}
                  value={formData.comprimento}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  m² por Rolo
                  {metrosQuadradosCalculados && (
                    <span className="ml-2 text-green-600 font-bold">= {metrosQuadradosCalculados} m²</span>
                  )}
                </label>
                <input
                  name="metrosQuadrados"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ou informe direto"
                  className={getInputClass("metrosQuadrados")}
                  value={metrosQuadradosCalculados || formData.metrosQuadrados}
                  onChange={handleChange}
                  disabled={!!metrosQuadradosCalculados}
                />
                {errors.metrosQuadrados && (
                  <span className="text-xs text-red-500 mt-1">{errors.metrosQuadrados}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rolos em Estoque *</label>
                <input
                  name="quantidadeRolos"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ex: 3"
                  className={getInputClass("quantidadeRolos")}
                  value={formData.quantidadeRolos}
                  onChange={handleChange}
                />
                {errors.quantidadeRolos && (
                  <span className="text-xs text-red-500 mt-1">{errors.quantidadeRolos}</span>
                )}
              </div>
            </div>

            {/* Total calculado */}
            {totalM2 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue font-medium">
                  Total em estoque: <span className="font-bold">{totalM2} m²</span>
                  <span className="text-gray-500 ml-2">
                    ({formData.quantidadeRolos} rolos × {metrosQuadradosCalculados || formData.metrosQuadrados} m²/rolo)
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tinta */}
        {formData.tipoInsumo === "TINTA" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
              Dados da Tinta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor *</label>
                <input
                  name="cor"
                  placeholder="Ex: Magenta"
                  className={getInputClass("cor")}
                  value={formData.cor}
                  onChange={handleChange}
                />
                {errors.cor && <span className="text-xs text-red-500 mt-1">{errors.cor}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho da Embalagem *</label>
                <select
                  name="tamanhoEmbalagem"
                  className={getInputClass("tamanhoEmbalagem")}
                  value={formData.tamanhoEmbalagem}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {TAMANHOS_EMBALAGEM.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.tamanhoEmbalagem && (
                  <span className="text-xs text-red-500 mt-1">{errors.tamanhoEmbalagem}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Estoque e Valor */}
        {formData.tipoInsumo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
              {formData.tipoInsumo === "SUBSTRATO" ? "Valor" : "Estoque e Valor"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.tipoInsumo !== "SUBSTRATO" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {labelEstoque[formData.tipoInsumo] || "Estoque Atual"} *
                  </label>
                  <input
                    name="estoqueAtual"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className={getInputClass("estoqueAtual")}
                    value={formData.estoqueAtual}
                    onChange={handleChange}
                  />
                  {errors.estoqueAtual && (
                    <span className="text-xs text-red-500 mt-1">{errors.estoqueAtual}</span>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Unitário (R$)
                </label>
                <input
                  name="valorUnitario"
                  placeholder="0,00"
                  className={getInputClass("valorUnitario")}
                  value={formData.valorUnitario}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !formData.tipoInsumo}
            className="bg-green hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Salvando..." : id ? "Salvar Mudanças" : "Cadastrar Insumo"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/insumos")}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormInsumo;