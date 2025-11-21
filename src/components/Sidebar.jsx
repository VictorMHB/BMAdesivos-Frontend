import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tag, Package, ShoppingCart, LogOut } from 'lucide-react';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200";
    const activeClass = "bg-green text-white shadow-md";
    const inactiveClass = "text-blue-100 hover:bg-blue-950 hover:text-white";

    return location.pathname === path 
      ? `${baseClass} ${activeClass}` 
      : `${baseClass} ${inactiveClass}`;
  };

    return (
        <aside className="w-64 bg-blue h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
            <div className="p-6 border-b border-blue-950">
                <h1 className="text-2xl font-bold text-white tracking-wide">BM Adesivos</h1>
                <p className="text-xs text-white mt-1">Gestão de Estoque</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-2">

            <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
            </Link>

            <Link to="/clientes" className={getLinkClass('/clientes')}>
            <Users size={20} />
            <span className="font-medium">Clientes</span>
            </Link>

            <Link to="/itens" className={getLinkClass('/itens')}>
            <Tag size={20} />
            <span className="font-medium">Itens</span>
            </Link>

            <Link to="/estoque" className={getLinkClass('/estoque')}>
            <Package size={20} />
            <span className="font-medium">Estoque</span>
            </Link>

            <Link to="/movimentacoes" className={getLinkClass('/movimentacoes')}>
            <ShoppingCart size={20} />
            <span className="font-medium">Entrada e Saída</span>
            </Link>

            </nav>

            <div className="p-4 border-t border-blue-950">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-blue hover:text-red-200 rounded-lg transition-colors"
                >
                    <LogOut className="text-white" size={20} />
                    <span className="font-medium text-white">Sair</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;