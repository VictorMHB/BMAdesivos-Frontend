import React, { useEffect, useState } from "react";
import { formatarCargo } from "../utils/formatters";
import {
  Package, ClipboardList, Clock, Settings,
  CheckCircle, AlertTriangle, XCircle, TrendingUp
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  const usuario = localStorage.getItem("usuarioNome") || "Usuário";
  const cargo = localStorage.getItem("usuarioCargo") || "";

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setDados(res.data))
      .catch(() => setDados(null))
      .finally(() => setLoading(false));
  }, []);

  const ordens = dados?.ordens;
  const estoque = dados?.estoque;

  const chartDonut = {
    labels: ["Pendente", "Em produção", "Concluído"],
    datasets: [{
      data: [ordens?.pendentes ?? 0, ordens?.emProducao ?? 0, ordens?.concluidas ?? 0],
      backgroundColor: ["#1E3D87", "#F97316", "#19AA4E"],
      borderWidth: 0,
    }],
  };

  const chartBarras = {
    labels: ordens?.concluidasPorMes?.map((m) => m.mes) ?? [],
    datasets: [{
      label: "Concluídas",
      data: ordens?.concluidasPorMes?.map((m) => m.total) ?? [],
      backgroundColor: "#19AA4E",
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#979DA5" } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 }, color: "#979DA5" } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: { legend: { display: false } },
  };

  const badgeEstoque = (nivel) => {
    if (nivel === "CRITICO") return { bg: "bg-red-100 text-red-700", label: "Crítico" };
    if (nivel === "ALERTA")  return { bg: "bg-yellow-100 text-yellow-700", label: "Médio" };
    return { bg: "bg-light-green text-green", label: "Alto" };
  };

  const porcentagem = (atual, minimo) => {
    if (!minimo || minimo === 0) return 100;
    return Math.min(Math.round((atual / minimo) * 100), 100);
  };

  if (loading) return (
    <div className="p-8 text-center text-gray">Carregando dados...</div>
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue">Dashboard</h1>
        <p className="text-gray mt-1">
          Bem-vindo, <span className="font-semibold text-blue">{usuario}</span>!
        </p>
      </div>

      {/* Cards topo */}
      <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>

        <div className="bg-white rounded-xl border border-ice shadow-sm p-5 flex items-center gap-4">
          <div className="bg-light-blue p-3 rounded-lg">
            <Package size={26} className="text-blue" />
          </div>
          <div>
            <p className="text-sm text-dark-gray font-medium">Total de Insumos</p>
            <p className="text-2xl font-bold text-blue">{estoque?.totalInsumos ?? "—"}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ice shadow-sm p-5 flex items-center gap-4">
          <div className="bg-light-green p-3 rounded-lg">
            <TrendingUp size={26} className="text-green" />
          </div>
          <div>
            <p className="text-sm text-dark-gray font-medium">Ordens Concluídas</p>
            <p className="text-2xl font-bold text-green">{ordens?.concluidas ?? "—"}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ice shadow-sm p-5 flex items-center gap-4">
          <div className="bg-light-orange p-3 rounded-lg">
            <AlertTriangle size={26} className="text-orange" />
          </div>
          <div>
            <p className="text-sm text-dark-gray font-medium">Alertas de Estoque</p>
            <p className="text-2xl font-bold text-orange">{(estoque?.criticos ?? 0) + (estoque?.alertas ?? 0)}</p>
          </div>
        </div>

      </div>

      {/* Visão Geral */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-blue whitespace-nowrap">Visão Geral</h2>
          <div className="flex-1 h-px bg-light-gray" />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-ice shadow-sm p-5">
            <p className="text-sm font-semibold text-blue mb-1">Ordens por status</p>
            <p className="text-xs text-gray mb-4">Distribuição atual das ordens ativas</p>
            <div className="flex gap-4 mb-3 flex-wrap">
              {[["#1E3D87", "Pendente"], ["#F97316", "Em produção"], ["#19AA4E", "Concluído"]].map(([cor, label]) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-dark-gray">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: cor }} />
                  {label}
                </span>
              ))}
            </div>
            <div style={{ height: 180 }}>
              <Doughnut data={chartDonut} options={donutOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ice shadow-sm p-5">
            <p className="text-sm font-semibold text-blue mb-1">Ordens concluídas</p>
            <p className="text-xs text-gray mb-4">Últimos 6 meses</p>
            <div style={{ height: 200 }}>
              <Bar data={chartBarras} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Tabela estoque */}
        <div>
          <p className="text-base font-semibold text-blue mb-3">Informações de Estoque</p>
          <div className="bg-white rounded-xl border border-ice shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-light-gray">
              <p className="text-sm font-semibold text-blue">Status do Estoque</p>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-light-gray/50 text-xs text-dark-gray font-semibold">
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Quantidade</th>
                  <th className="px-5 py-3">Mínimo</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                {estoque?.insumosCriticos?.length > 0 ? (
                  estoque.insumosCriticos.map((insumo) => {
                    const badge = badgeEstoque(insumo.nivel);
                    return (
                      <tr key={insumo.id} className="hover:bg-light-gray/30 transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-dark-gray">{insumo.nome}</p>
                          <p className="text-xs text-gray">{insumo.tipoInsumo}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-dark-gray">
                          {insumo.estoqueAtual} {insumo.unidadeMedida ?? ""}
                        </td>
                        <td className="px-5 py-3 text-sm text-dark-gray">
                          {insumo.estoqueMinimo} {insumo.unidadeMedida ?? ""}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray text-sm">
                      Nenhum alerta de estoque no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;