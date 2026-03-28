import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';

import ListClientes from './pages/cliente/ListClientes';
import FormCliente from './pages/cliente/FormCliente';

import ListFuncionarios from './pages/funcionario/ListFuncionarios';
import FormFuncionario from './pages/funcionario/FormFuncionario';

import ListInsumos from './pages/insumo/ListInsumos';
import FormInsumo from './pages/insumo/FormInsumo';

import ListAdesivos from './pages/adesivos/ListAdesivos';
import FormAdesivo from './pages/adesivos/FormAdesivo';
import FormFichaTecnica from './pages/adesivos/FormFichaTecnica';

import ListOrdens from './pages/ordem/ListOrdens';

import PrivateLayout from './layouts/PrivateLayout';


function App() {
  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateLayout />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />

        <Route path="/clientes" element={<ListClientes />} />
        <Route path="/clientes/novo" element={<FormCliente />} />
        <Route path="/clientes/editar/:id" element={<FormCliente />} />

        <Route path="/funcionarios" element={<ListFuncionarios />} />
        <Route path="/funcionarios/novo" element={<FormFuncionario />} />
        <Route path="/funcionarios/editar/:id" element={<FormFuncionario />} />

        <Route path="/insumos" element={<ListInsumos />} />
        <Route path="/insumos/novo" element={<FormInsumo />} />
        <Route path="/insumos/editar/:id" element={<FormInsumo />} />

        <Route path="/adesivos" element={<ListAdesivos />} />
        <Route path="/adesivos/novo" element={<FormAdesivo/>} />
        <Route path="/adesivos/editar/:id" element={<FormAdesivo />} />

        <Route path="/adesivos/:id/ficha-tecnica" element={<FormFichaTecnica />} />

        <Route path="/ordens" element={<ListOrdens />} />
        
        
      </Route>
        
    </Routes>
    </>
  );
}

export default App;