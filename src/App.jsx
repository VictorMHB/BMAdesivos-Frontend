import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaClientes from './pages/ListaClientes';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<ListaClientes />} />
        <Route path="/clientes" element={<ListaClientes />} />
        {/* <Route path="/clientes/novo" element={<FormCliente />} /> */}
        {/* <Route path="/clientes/editar/:id" element={<FormCliente />} /> */}
      </Routes>
    </div>
  );
}

export default App;