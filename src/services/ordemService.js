import api from "../services/api";

const BASE_URL = "/ordens";

const getAll = () => api.get(`${BASE_URL}/todas`);
const getById = (id) => api.get(`${BASE_URL}/${id}`);
const criar = (data) => api.post(`${BASE_URL}/nova`, data);
const avancar = (id) => api.patch(`${BASE_URL}/${id}/avancar`);
const finalizar = (id) => api.patch(`${BASE_URL}/${id}/finalizar`);
const cancelar = (id) => api.patch(`${BASE_URL}/${id}/cancelar`);

export default { getAll, getById, criar, avancar, finalizar, cancelar };