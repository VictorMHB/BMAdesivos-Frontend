import React, { useState, useEffect } from "react";
import ordemService from "../../services/ordemService";
import adesivoService from "../../services/adesivoService";
import clienteService from "../../services/clienteService";
import { X, Plus, Trash2, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";

function FormOrdem({ onClose, onSucesso }) {
  const [clientes, setClientes] = useState([]);
  const [adesivos, setAdesivos] = useState([]);
  const [adesivosDoCliente, setAdesivosDoCliente] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");
  const [itens, setItens] = useState([{ adesivoId: "", quantidade: "" }]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const usuarioId = localStorage.getItem("usuarioId");
  const usuarioNome = localStorage.getItem("usuarioNome");

  useEffect(() => {
    clienteService.getAll().then((res) => setClientes(res.data.filter((c) => c.ativo)));
    adesivoService.getAll().then((res) => setAdesivos(res.data.filter((a) => a.ativo)));
  }, []);

  const handleClienteChange = (e) => {
    const id = e.target.value;
    setClienteId(id);
    setAdesivosDoCliente(adesivos.filter((a) => String(a.cliente?.id) === id));
    setItens([{ adesivoId: "", quantidade: "" }]);
    setErrors({});
  };

  const handleItemChange = (index, field, value) => {
    setItens((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    if (errors[`item_${index}_${field}`])
      setErrors((prev) => ({ ...prev, [`item_${index}_${field}`]: null }));
  };

  const adicionarItem = () => {
    setItens((prev) => [...prev, { adesivoId: "", quantidade: "" }]);
  };

  const removerItem = (index) => {
    if (itens.length === 1) return;
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!clienteId) newErrors.clienteId = "Selecione um cliente.";
    itens.forEach((item, i) => {
      if (!item.adesivoId) newErrors[`item_${i}_adesivoId`] = "Selecione um adesivo.";
      if (!item.quantidade || Number(item.quantidade) <= 0)
        newErrors[`item_${i}_quantidade`] = "Informe a quantidade.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await ordemService.criar({
        funcionarioId: Number(usuarioId),
        clienteId: Number(clienteId),
        dataPrazo: dataPrazo || null,
        itens: itens.map((item) => ({
          adesivoId: Number(item.adesivoId),
          quantidade: Number(item.quantidade),
        })),
      });
      toast.success("Ordem criada com sucesso!");
      onSucesso();
    } catch (error) {
      toast.error(error.response?.data || "Erro ao criar ordem.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => {
    const base = "w-full px-4 py-2 text-dark-gray bg-white border rounded-md focus:outline-none focus:ring-2 transition-all ";
    return errors[field]
      ? base + "border-red-500 focus:ring-red-500 placeholder-red-300"
      : base + "border-gray-300 focus:ring-blue";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-300" />
            Nova Ordem de Produção
          </h2>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto" noValidate>

          {/* Responsável */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Responsável
            </label>
            <input
              readOnly
              value={usuarioNome || ""}
              className="w-full px-4 py-2 bg-light-gray border border-ice rounded-md text-dark-gray text-sm"
            />
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Cliente *
            </label>
            <select className={inputClass("clienteId")} value={clienteId} onChange={handleClienteChange}>
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            {errors.clienteId && <span className="text-xs text-red-500 mt-1 block">{errors.clienteId}</span>}
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Prazo de entrega
            </label>
            <input
              type="datetime-local"
              className={inputClass("dataPrazo")}
              value={dataPrazo}
              onChange={(e) => setDataPrazo(e.target.value)}
            />
          </div>

          {/* Itens */}
          {clienteId && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Adesivos *
                </label>
                <button
                  type="button"
                  onClick={adicionarItem}
                  className="flex items-center gap-1 text-xs text-blue hover:text-blue-900 font-semibold cursor-pointer transition-colors"
                >
                  <Plus size={13} /> Adicionar item
                </button>
              </div>

              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={index} className="bg-light-gray/40 border border-ice rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Item {index + 1}
                      </span>
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerItem(index)}
                          className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                          title="Remover item"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Adesivo</label>
                      <select
                        className={inputClass(`item_${index}_adesivoId`)}
                        value={item.adesivoId}
                        onChange={(e) => handleItemChange(index, "adesivoId", e.target.value)}
                      >
                        <option value="">Selecione o adesivo</option>
                        {adesivosDoCliente.map((a) => (
                          <option key={a.id} value={a.id}>{a.nome}</option>
                        ))}
                      </select>
                      {errors[`item_${index}_adesivoId`] && (
                        <span className="text-xs text-red-500 mt-1 block">{errors[`item_${index}_adesivoId`]}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Ex: 100"
                        className={inputClass(`item_${index}_quantidade`)}
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, "quantidade", e.target.value)}
                      />
                      {errors[`item_${index}_quantidade`] && (
                        <span className="text-xs text-red-500 mt-1 block">{errors[`item_${index}_quantidade`]}</span>
                      )}
                    </div>
                  </div>
                ))}

                {adesivosDoCliente.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3 italic">
                    Nenhum adesivo cadastrado para este cliente.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
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