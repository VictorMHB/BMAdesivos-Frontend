import axios from "axios";

const API_URL = "http://localhost:8080/clientes";

const getAll = () => {
    return axios.get(`${API_URL}/todos`);
}

const getById = () => {
    return axios.get(`${API_URL}/${id}`);
}

const create = (data) => {
    return axios.post(`${API_URL}/novo`, data);
}

const update = (data) => {
    return axios.put(`${API_URL}/atualizar`, data);
}

const remove = (id) => {
    return axios.delete(`${API_URL}/apagar/${id}`)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
};