import api from "../services/api";

const BASE_URL = (adesivoId) => `/adesivos/${adesivoId}/ficha-tecnica`;

const getAll = (adesivoId) => api.get(BASE_URL(adesivoId));
const criar = (adesivoId, data) => api.post(`${BASE_URL(adesivoId)}/novo`, data);
const deletar = (adesivoId, itemId) => api.delete(`${BASE_URL(adesivoId)}/${itemId}`);

export default {
    getAll,
    criar,
    deletar
};