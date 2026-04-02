import api from "../services/api";

const BASE_URL = "/ordens";

const getAll = () => api.get(`${BASE_URL}/todas`);
const getHistorico = () => api.get(`${BASE_URL}/historico`);
const getById = (id) => api.get(`${BASE_URL}/${id}`);
const criar = (data) => api.post(`${BASE_URL}/nova`, data);
const avancar = (id) => api.patch(`${BASE_URL}/${id}/avancar`);
const finalizar = (id) => api.patch(`${BASE_URL}/${id}/finalizar`);
const arquivar = (id) => api.patch(`${BASE_URL}/${id}/arquivar`);
const cancelar = (id) => api.patch(`${BASE_URL}/${id}/cancelar`);

export default { getAll, getById, criar, avancar, finalizar, cancelar, getHistorico, arquivar };