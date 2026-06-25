import api from "../services/api";

const BASE_URL = "/insumos";

const getAll = () => api.get(BASE_URL);
const getById = (id) => api.get(`${BASE_URL}/${id}`);
const criar = (data) => api.post(`${BASE_URL}/novo`, data);
const editar = (id, data) => api.patch(`${BASE_URL}/editar/${id}`, data);
const deletar = (id) => api.delete(`${BASE_URL}/apagar/${id}`);
const registrarEntrada = (id, data) => api.patch(`${BASE_URL}/${id}/entrada`, data);

export default { 
    getAll, 
    getById, 
    criar, 
    editar, 
    deletar,
    registrarEntrada,
};