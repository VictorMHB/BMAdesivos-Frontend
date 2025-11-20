import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import ListaClientes from './pages/Clientes';
import PrivateLayout from './layouts/PrivateLayout';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateLayout />}> 
        {/* <Route path="/dashboard" element={<ListaClientes />} /> */}
        <Route path="/clientes" element={<ListaClientes />} />
        {/* <Route path="/estoque" element={<ListaClientes />} /> */}
      </Route>
        
    </Routes>
  );
}

export default App;