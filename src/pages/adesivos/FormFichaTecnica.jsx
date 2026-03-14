import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fichaTecnicaService from "../../services/fichaTecnicaService";
import adesivoService from "../../services/adesivoService";
import insumoService from "../../services/insumoService";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

function FormFichaTecnica() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [adesivo, setAdesivo] = useState(null);
  const [itens, setItens] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    insumoId: "",
    quantidade: "",
  });

  const insumoSelecionado = insumos.find(
    (i) => i.id === Number(formData.insumoId)
  );
  const isTinta = insumoSelecionado?.tipoInsumo === "TINTA";

  useEffect(() => {
    Promise.all([
      adesivoService.getById(id),
      fichaTecnicaService.getAll(id),
      insumoService.getAll(),
    ])
      .then(([adesivoRes, fichaRes, insumosRes]) => {
        setAdesivo(adesivoRes.data);
        setItens(fichaRes.data);
        setInsumos(insumosRes.data.filter((i) => i.ativo));
      })
      .catch(() => toast.error("Erro ao carregar dados."))
      .finally(() => setLoading(false));
  }, [id]);

  const carregarItens = () => {
    fichaTecnicaService.getAll(id).then((res) => setItens(res.data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.insumoId) newErrors.insumoId = "Selecione um insumo.";
    if (!isTinta && (!formData.quantidade || Number(formData.quantidade) <= 0)) {
      newErrors.quantidade = "Quantidade é obrigatória para este tipo de insumo.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSalvando(true);
    try {
      await fichaTecnicaService.criar(id, {
        insumoId: Number(formData.insumoId),
        quantidade: isTinta ? null : Number(formData.quantidade),
      });
      toast.success("Insumo adicionado à ficha!");
      setFormData({ insumoId: "", quantidade: "" });
      carregarItens();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao adicionar insumo.");
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (itemId) => {
    if (!window.confirm("Deseja remover este insumo da ficha?")) return;
    try {
      await fichaTecnicaService.deletar(id, itemId);
      toast.success("Insumo removido da ficha!");
      carregarItens();
    } catch (error) {
      toast.error("Erro ao remover insumo.");
    }
  };

  const formatarTipoInsumo = (tipo) => {
    const tipos = {
      SUBSTRATO: "Substrato",
      TINTA: "Tinta",
      RESINA: "Resina",
      OUTRO: "Outro",
    };
    return tipos[tipo] || tipo;
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-2 text-dark-gray bg-white border rounded-md focus:outline-none focus:ring-2 transition-all ";
    if (errors[fieldName]) {
      return base + "border-red-500 focus:ring-red-500 placeholder-red-300";
    }
    return base + "border-gray-300 focus:ring-blue";
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;

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
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Ficha Técnica</h1>
          {adesivo && (
            <p className="text-sm text-gray-500 mt-1">
              {adesivo.nome} — {adesivo.cliente?.nome}
            </p>
          )}
        </div>
      </div>

      {/* Formulário para adicionar insumo */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold text-blue mb-4 border-b pb-2">
          Adicionar Insumo
        </h2>
        <form onSubmit={handleAdicionar} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insumo *
              </label>
              <select
                name="insumoId"
                className={getInputClass("insumoId")}
                value={formData.insumoId}
                onChange={handleChange}
              >
                <option value="">Selecione o insumo</option>
                {insumos.map((insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.nome} ({formatarTipoInsumo(insumo.tipoInsumo)})
                  </option>
                ))}
              </select>
              {errors.insumoId && (
                <span className="text-xs text-red-500 mt-1">{errors.insumoId}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade {isTinta ? "(opcional)" : "*"}
              </label>
              <input
                name="quantidade"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                className={getInputClass("quantidade")}
                value={formData.quantidade}
                onChange={handleChange}
                disabled={isTinta}
              />
              {errors.quantidade && (
                <span className="text-xs text-red-500 mt-1">{errors.quantidade}</span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={salvando}
              className="bg-green hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Plus size={18} />
              {salvando ? "Adicionando..." : "Adicionar Insumo"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de insumos da ficha */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-blue">
            Insumos da Ficha
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: <span className="font-bold text-gray-800">{itens.length}</span> insumos
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <th className="px-6 py-4 border-b">Insumo</th>
                <th className="px-6 py-4 border-b">Tipo</th>
                <th className="px-6 py-4 border-b">Unidade</th>
                <th className="px-6 py-4 border-b">Quantidade</th>
                <th className="px-6 py-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {itens.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.insumo.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarTipoInsumo(item.insumo.tipoInsumo)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.insumo.unidadeMedida}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.quantidade != null ? `${item.quantidade} cm` : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRemover(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                      title="Remover da ficha"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {itens.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    Nenhum insumo adicionado à ficha ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormFichaTecnica;