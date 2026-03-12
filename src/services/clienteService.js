import api from "./api";

const BASE_URL = "/clientes";

const getAll = () => { return api.get(`${BASE_URL}/todos`); }
const getById = (id) => { return api.get(`${BASE_URL}/${id}`); }
const criar = (data) => { return api.post(`${BASE_URL}/novo`, data); }
const editar = (id, data) => { return api.patch(`${BASE_URL}/editar/${id}`, data) }
const deletar = (id) => { return api.delete(`${BASE_URL}/apagar/${id}`) }

export default {
    getAll,
    getById,
    criar,
    editar,
    deletar
};