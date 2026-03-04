import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            const requerTroca = localStorage.getItem("requerTrocaSenha") === "true";

            if (requerTroca) {
                console.warn("Acesso bloqueado: Alteração de senha obrigatória.");
            }
        }

        if (error.response && error.response.status === 401) {
            const isLoginRoute = window.location.pathname === "/login" || window.location.pathname === "/";

            if (!isLoginRoute) {
                localStorage.clear();
                window.location.href = "/login";
            }
            
        }

        return Promise.reject(error);
    }
);

export default api;