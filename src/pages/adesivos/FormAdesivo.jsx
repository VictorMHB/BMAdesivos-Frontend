import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adesivoService from "../../services/adesivoService";
import clienteService from "../../services/clienteService";
import insumoService from "../../services/insumoService";
import { maskMoeda } from "../../utils/masks";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const TIPOS_ADESIVO = [
  { value: "ETIQUETA_METALICA", label: "Etiqueta Metálica" },
  { value: "ADESIVO_COMUM", label: "Adesivo Comum" },
  { value: "ADESIVO_RESINADO", label: "Adesivo Resinado" },
];

function FormAdesivo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [substratos, setSubstratos] = useState([]);
  const [resinas, setResinas] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipoAdesivo: "",
    comprimento: "",
    altura: "",
    valorUnitario: "",
    clienteId: "",
    substratoId: "",
    resinaId: "",
  });

  useEffect(() => {
    clienteService.getAll().then((res) => {
      setClientes(res.data.filter((c) => c.ativo));
    });

    insumoService.getAll().then((res) => {
      const ativos = res.data.filter((i) => i.ativo);
      setSubstratos(ativos.filter((i) => i.tipoInsumo === "SUBSTRATO"));
      setResinas(ativos.filter((i) => i.tipoInsumo === "RESINA"));
    });

    if (id) {
      adesivoService
        .getById(id)
        .then((res) => {
          const dados = res.data;
          const dadosFormatados = {
            nome: dados.nome || "",
            descricao: dados.descricao || "",
            tipoAdesivo: dados.tipoAdesivo || "",
            comprimento: dados.comprimento ?? "",
            altura: dados.altura ?? "",
            valorUnitario:
              dados.valorUnitario != null
                ? maskMoeda(String(Math.round(dados.valorUnitario * 100)))
                : "",
            clienteId: dados.cliente?.id ?? "",
            substratoId: "",
            resinaId: "",
          };
          setFormData(dadosFormatados);
          setOriginalData(dadosFormatados);
        })
        .catch(() => toast.error("Erro ao carregar dados do adesivo."));
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
    else if (formData.nome.trim().length < 3)
      newErrors.nome = "Nome deve ter no mínimo 3 caracteres.";

    if (!formData.tipoAdesivo)
      newErrors.tipoAdesivo = "Tipo do adesivo é obrigatório.";
    if (!formData.clienteId) newErrors.clienteId = "Cliente é obrigatório.";
    if (!formData.valorUnitario)
      newErrors.valorUnitario = "Preço de venda é obrigatório.";

    if (formData.comprimento && Number(formData.comprimento) <= 0)
      newErrors.comprimento = "Comprimento deve ser maior que zero.";
    if (formData.altura && Number(formData.altura) <= 0)
      newErrors.altura = "Altura deve ser maior que zero.";

    if (!id) {
      if (!formData.substratoId)
        newErrors.substratoId = "Substrato é obrigatório.";
      if (formData.tipoAdesivo === "ADESIVO_RESINADO" && !formData.resinaId)
        newErrors.resinaId = "Resina é obrigatória para adesivos resinados.";
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
      tipoAdesivo: formData.tipoAdesivo,
      comprimento:
        formData.comprimento !== "" ? Number(formData.comprimento) : null,
      altura: formData.altura !== "" ? Number(formData.altura) : null,
      valorUnitario: formData.valorUnitario
        ? Number(
            String(formData.valorUnitario).replace(/\./g, "").replace(",", "."),
          )
        : null,
      clienteId: Number(formData.clienteId),
      substratoId: formData.substratoId ? Number(formData.substratoId) : null,
      resinaId: formData.resinaId ? Number(formData.resinaId) : null,
    };

    try {
      if (id) {
        await adesivoService.editar(id, dadosLimpos);
        toast.success("Adesivo atualizado com sucesso!");
      } else {
        await adesivoService.criar(dadosLimpos);
        toast.success("Adesivo cadastrado com sucesso!");
      }
      navigate("/adesivos");
    } catch (error) {
      toast.error(error.response?.data || "Erro ao salvar adesivo.");
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
    if (
      id &&
      originalData &&
      String(formData[fieldName]) !== String(originalData[fieldName])
    ) {
      return (
        base +
        "border-blue border-2 focus:ring-blue bg-blue-50 text-blue font-medium"
      );
    }
    return base + "border-gray-300 focus:ring-blue";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/adesivos")}
          className="p-2 hover:bg-light-gray rounded-full transition-colors text-blue hover:text-blue-900 cursor-pointer"
          title="Voltar para lista"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {id ? "Editar Adesivo" : "Cadastrar Adesivo"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        noValidate
      >
        {/* Dados do Adesivo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Dados do Adesivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                name="nome"
                placeholder="Ex: Adesivo Personalizado"
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
                Tipo de Adesivo *
              </label>
              <select
                name="tipoAdesivo"
                className={getInputClass("tipoAdesivo")}
                value={formData.tipoAdesivo}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                {TIPOS_ADESIVO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              {errors.tipoAdesivo && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.tipoAdesivo}
                </span>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="descricao"
              placeholder="Descreva o adesivo..."
              rows={3}
              className={getInputClass("descricao")}
              value={formData.descricao}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dimensões */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Dimensões
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comprimento (cm)
              </label>
              <input
                name="comprimento"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                className={getInputClass("comprimento")}
                value={formData.comprimento}
                onChange={handleChange}
              />
              {errors.comprimento && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.comprimento}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm)
              </label>
              <input
                name="altura"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                className={getInputClass("altura")}
                value={formData.altura}
                onChange={handleChange}
              />
              {errors.altura && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.altura}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área (cm²){" "}
                <span className="text-xs text-gray-400 font-normal">
                  — calculado automaticamente
                </span>
              </label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 font-medium cursor-not-allowed"
                value={
                  formData.comprimento &&
                  formData.altura &&
                  Number(formData.comprimento) > 0 &&
                  Number(formData.altura) > 0
                    ? `${(Number(formData.comprimento) * Number(formData.altura)).toFixed(2)} cm²`
                    : "—"
                }
              />
            </div>
          </div>
        </div>

        {/* Insumos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Insumos{" "}
            {id && (
              <span className="text-sm font-normal text-gray-400">
                (deixe em branco para manter os atuais)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Substrato {!id && "*"}
              </label>
              <select
                name="substratoId"
                className={getInputClass("substratoId")}
                value={formData.substratoId}
                onChange={handleChange}
              >
                <option value="">Selecione o substrato</option>
                {substratos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}{" "}
                    {s.metrosQuadrados ? `— ${s.metrosQuadrados} m²` : ""}
                  </option>
                ))}
              </select>
              {errors.substratoId && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.substratoId}
                </span>
              )}
            </div>

            {formData.tipoAdesivo === "ADESIVO_RESINADO" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resina {!id && "*"}
                </label>
                <select
                  name="resinaId"
                  className={getInputClass("resinaId")}
                  value={formData.resinaId}
                  onChange={handleChange}
                >
                  <option value="">Selecione a resina</option>
                  {resinas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome}
                    </option>
                  ))}
                </select>
                {errors.resinaId && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.resinaId}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comercial */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
            Comercial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço de Venda (R$) *
              </label>
              <input
                name="valorUnitario"
                placeholder="0,00"
                className={getInputClass("valorUnitario")}
                value={formData.valorUnitario}
                onChange={handleChange}
              />
              {errors.valorUnitario && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.valorUnitario}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <select
                name="clienteId"
                className={getInputClass("clienteId")}
                value={formData.clienteId}
                onChange={handleChange}
              >
                <option value="">Selecione o cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
              {errors.clienteId && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.clienteId}
                </span>
              )}
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
            {loading
              ? "Salvando..."
              : id
                ? "Salvar Mudanças"
                : "Cadastrar Adesivo"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/adesivos")}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormAdesivo;
