
import { Navigate } from "react-router-dom";
import { useUsuario } from "../contexto/UsuarioContexto";
import Swal from "sweetalert2";

export default function RotaAdmin({ children }) {
    const { token, usuario, saindoDaConta } = useUsuario();

    if (!token) {
        if (!saindoDaConta) {
            Swal.fire({
                icon: "warning",
                title: "Você precisa estar logado",
                text: "Faça login para continuar",
            });
        }

        return <Navigate to="/entrar" replace />;
    }

    if (usuario?.role !== "admin") {
        Swal.fire({
            icon: "error",
            title: "Acesso negado",
            text: "Você não tem permissão para acessar esta página.",
        });

        return <Navigate to="/" replace />;
    }

    return children;
}
