import React from "react";
import { formatarCargo } from "../utils/formatters";
import { Package, Users, ShoppingCart, Tag, TrendingUp, AlertTriangle } from "lucide-react";

function Dashboard() {
  const usuario = localStorage.getItem("usuarioNome") || "Usuário";
  const cargo = localStorage.getItem("usuarioCargo") || "";
  const isAdmin = cargo === "ADMIN";

  const cards = [
    { label: "Clientes", value: "—", icon: <Users size={28} />, color: "bg-blue-600" },
    { label: "Itens Cadastrados", value: "—", icon: <Tag size={28} />, color: "bg-purple-600" },
    { label: "Estoque Total", value: "—", icon: <Package size={28} />, color: "bg-green-600" },
    { label: "Movimentações", value: "—", icon: <ShoppingCart size={28} />, color: "bg-orange-500" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo, <span className="font-semibold text-blue-700">{usuario}</span>!
        </p>
      </div>

      {/* Cards */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info banner */}
      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
        <TrendingUp className="text-blue-600 mt-1 shrink-0" size={24} />
        <div>
          <h2 className="font-semibold text-blue-800 text-lg">Sistema em desenvolvimento</h2>
          <p className="text-blue-600 text-sm mt-1">
            Os módulos de estoque, clientes, itens e movimentações estão sendo implementados.
            Use o menu lateral para navegar pelas seções disponíveis.
          </p>
        </div>
      </div>

      {/* Aviso de estoque baixo */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
        <AlertTriangle className="text-yellow-500 mt-1 shrink-0" size={24} />
        <div>
          <h2 className="font-semibold text-yellow-800 text-lg">Estoque baixo</h2>
          <p className="text-yellow-600 text-sm mt-1">
            Nenhum alerta de estoque disponível por enquanto. Quando os produtos forem cadastrados, alertas aparecerão aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;