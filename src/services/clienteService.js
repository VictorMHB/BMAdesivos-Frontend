import api from "./api";

const BASE_URL = "/clientes";

const getAll = () => {
    return api.get(`${BASE_URL}/todos`);
}

const getById = (id) => {
    return api.get(`${BASE_URL}/${id}`);
}

const create = (data) => {
    return api.post(`${BASE_URL}/novo`, data);
}

const update = (data) => {
    return api.put(`${BASE_URL}/editar`, data);
}

const patch = (id, data) => {
    return api.patch(`${BASE_URL}/editar/${id}`, data)
}

const remove = (id) => {
    return api.delete(`${BASE_URL}/apagar/${id}`)
}

export default {
    getAll,
    getById,
    create,
    update,
    patch,
    remove
};