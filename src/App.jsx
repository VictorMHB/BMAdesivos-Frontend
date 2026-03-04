import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import ListClientes from './pages/ListClientes';
import FormCliente from './pages/FormCliente';
import PrivateLayout from './layouts/PrivateLayout';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateLayout />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<ListClientes />} />
        <Route path="/clientes/novo" element={<FormCliente />} />
        <Route path="/clientes/editar/:id" element={<FormCliente />} />
        <Route path="/perfil" element={<Perfil />} />
        {/* <Route path="/estoque" element={<ListaClientes />} /> */}
      </Route>
        
    </Routes>
    </>
  );
}

export default App;