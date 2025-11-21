import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import ListClientes from './pages/ListClientes';
import FormCliente from './pages/FormCliente';
import PrivateLayout from './layouts/PrivateLayout';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateLayout />}> 
        {/* <Route path="/dashboard" element={<ListaClientes />} /> */}
        <Route path="/clientes" element={<ListClientes />} />
        <Route path="/clientes/novo" element={<FormCliente />} />
        {/* <Route path="/estoque" element={<ListaClientes />} /> */}
      </Route>
        
    </Routes>
  );
}

export default App;