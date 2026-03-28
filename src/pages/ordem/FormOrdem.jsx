import React, { useState, useEffect } from "react";
import ordemService from "../../services/ordemService";
import adesivoService from "../../services/adesivoService";
import { X } from "lucide-react";
import { toast } from "react-toastify";

function FormOrdem({ onClose, onSucesso }) {
  const [adesivos, setAdesivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteAutomatic, setClienteAutomatico] = useState("");
  const [errors, setErrors] = useState({});

  const usuarioId = localStorage.getItem("usuarioId");
  const usuarioNome = localStorage.getItem("usuarioNome");

  const [formData, setFormData] = useState({
    adesivoId: "",
    qtdPedida: "",
  });

  useEffect(() => {
    adesivoService.getAll().then((res) => {
      setAdesivos(res.data.filter((a) => a.ativo));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "adesivoId") {
      const adesivo = adesivos.find((a) => a.id === Number(value));
      setClienteAutomatico(adesivo?.cliente?.nome || "");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.adesivoId) newErrors.adesivoId = "Selecione um adesivo.";
    if (!formData.qtdPedida || Number(formData.qtdPedida) <= 0)
      newErrors.qtdPedida = "Quantidade deve ser maior que zero.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await ordemService.criar({
        adesivoId: Number(formData.adesivoId),
        funcionarioId: Number(usuarioId),
        qtdPedida: Number(formData.qtdPedida),
      });
      toast.success("Ordem criada com sucesso!");
      onSucesso();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao criar ordem.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base = "w-full px-4 py-2 text-dark-gray bg-white border rounded-md focus:outline-none focus:ring-2 transition-all ";
    if (errors[fieldName]) return base + "border-red-500 focus:ring-red-500 placeholder-red-300";
    return base + "border-gray-300 focus:ring-blue";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Cabeçalho */}
        <div className="bg-blue p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Nova Ordem de Produção</h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>

          {/* Funcionário (automático) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <input
              readOnly
              value={usuarioNome || ""}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
            />
          </div>

          {/* Adesivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adesivo *</label>
            <select
              name="adesivoId"
              className={getInputClass("adesivoId")}
              value={formData.adesivoId}
              onChange={handleChange}
            >
              <option value="">Selecione o adesivo</option>
              {adesivos.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
            {errors.adesivoId && <span className="text-xs text-red-500 mt-1">{errors.adesivoId}</span>}
          </div>

          {/* Cliente (automático) */}
          {clienteAutomatic && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                readOnly
                value={clienteAutomatic}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
          )}

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
            <input
              name="qtdPedida"
              type="number"
              min="1"
              step="1"
              placeholder="Ex: 100"
              className={getInputClass("qtdPedida")}
              value={formData.qtdPedida}
              onChange={handleChange}
            />
            {errors.qtdPedida && <span className="text-xs text-red-500 mt-1">{errors.qtdPedida}</span>}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Criando..." : "Criar Ordem"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormOrdem;