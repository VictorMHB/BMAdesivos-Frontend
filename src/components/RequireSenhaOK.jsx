import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireSenhaOk() {
  const location = useLocation();
  const requerTrocarSenha = localStorage.getItem("requerTrocarSenha") === "true";

  if (requerTrocarSenha && location.pathname !== "/perfil") {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
}

export default RequireSenhaOk;