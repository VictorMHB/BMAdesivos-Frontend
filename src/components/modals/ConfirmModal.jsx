import React from "react";

export default function ConfirmModal({ 
  titulo, 
  mensagem, 
  textoConfirmar = "Confirmar", 
  textoCancelar = "Cancelar", 
  corBotao = "red",
  onConfirm, 
  onCancel 
}) {
  
  const corConfirmar = corBotao === "green" 
    ? "bg-green hover:bg-green-800 text-white" 
    : "bg-red-500 hover:bg-red-600 text-white";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {titulo}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {mensagem}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-bold rounded-md transition-colors cursor-pointer ${corConfirmar}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}