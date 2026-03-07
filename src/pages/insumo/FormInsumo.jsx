import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import insumoService from "../../services/insumoService";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { maskMoeda } from "../../utils/masks";

function FormInsumo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    unidadeMedida: "",
    estoqueAtual: "",
    estoqueMinimo: "",
    valorUnitario: "",
  });

  useEffect(() => {
    if (id) {
      insumoService
        .getById(id)
        .then((res) => {
          const dados = res.data;
          const dadosFormatados = {
            nome: dados.nome || "",
            unidadeMedida: dados.unidadeMedida || "",
            estoqueAtual: dados.estoqueAtual ?? "",
            estoqueMinimo: dados.estoqueMinimo ?? "",
            valorUnitario: dados.valorUnitario != null
              ? maskMoeda(String(Math.round(dados.valorUnitario * 100)))
              : "",
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

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome?.trim()) newErrors.nome = "Nome é obrigatório.";
    if (!formData.unidadeMedida?.trim()) newErrors.unidadeMedida = "Unidade de medida é obrigatória.";
    if (formData.estoqueMinimo === "" || formData.estoqueMinimo == null)
      newErrors.estoqueMinimo = "Estoque mínimo é obrigatório.";
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
      estoqueAtual: formData.estoqueAtual !== "" ? Number(formData.estoqueAtual) : 0,
      estoqueMinimo: Number(formData.estoqueMinimo),
      valorUnitario: formData.valorUnitario && formData.valorUnitario !== ""
        ? Number(String(formData.valorUnitario).replace(/\./g, "").replace(",", "."))
        : null,
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
        {/* Dados do Insumo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Dados do Insumo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                name="nome"
                placeholder="Ex: Vinil Adesivo"
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
                Unidade de Medida *
              </label>
              <select
                name="unidadeMedida"
                className={getInputClass("unidadeMedida")}
                value={formData.unidadeMedida}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="m²">m²</option>
                <option value="m">m (metro)</option>
                <option value="kg">kg</option>
                <option value="L">L (litro)</option>
                <option value="un">un (unidade)</option>
                <option value="rolo">rolo</option>
              </select>
              {errors.unidadeMedida && (
                <span className="text-xs text-red-500 mt-1">{errors.unidadeMedida}</span>
              )}
            </div>
          </div>
        </div>

        {/* Estoque */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Estoque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Atual
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Mínimo *
              </label>
              <input
                name="estoqueMinimo"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                className={getInputClass("estoqueMinimo")}
                value={formData.estoqueMinimo}
                onChange={handleChange}
              />
              {errors.estoqueMinimo && (
                <span className="text-xs text-red-500 mt-1">{errors.estoqueMinimo}</span>
              )}
            </div>
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

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
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