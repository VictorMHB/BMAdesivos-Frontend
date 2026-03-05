import api from "./api";

const BASE_URL = "/funcionarios";

const getAll = () => api.get(`${BASE_URL}/todos`);

const getById = (id) => api.get(`${BASE_URL}/${id}`);

const criar = (data) => api.post(`${BASE_URL}/novo`, data);

const editar = (id, data) => api.patch(`${BASE_URL}/editar/${id}`, data);

const patch = (id, data) => api.patch(`${BASE_URL}/editar/${id}`, data);

const deletar = (id) => api.delete(`${BASE_URL}/apagar/${id}`);

export default {
    getAll,
    getById,
    criar,
    editar,
    patch,
    deletar
};