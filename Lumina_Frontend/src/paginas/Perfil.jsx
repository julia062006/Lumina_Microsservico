import { LogOut, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../contexto/UsuarioContexto";
import { BotaoPrimario, BotaoSecundario } from "../componentes/Botao";
import fundo from "../imagens/planofundo2.png";
import { excluirUsuario } from "../services/api";
import { alertaConfirmacao, alertaSucesso, alertaErro } from "../utilitarios/formulario";
import { MENSAGENS } from "../utilitarios/validacoes";
import Avatar from "../componentes/Avatar";
import { urlFotoPerfil } from "../utilitarios/formatadores";

function Perfil() {

    const navigate = useNavigate();
    const { usuario, sair: sairContexto } = useUsuario();

    function sair() {
        sairContexto();
        navigate("/entrar");
    }

    async function excluir(id) {

        const resultado = await alertaConfirmacao();
        if (!resultado.isConfirmed) return;

        try {
            await excluirUsuario(id);
            await alertaSucesso("Conta excluída com sucesso!");
            sairContexto();
            navigate("/entrar");
        } catch (erro) {
            await alertaErro(MENSAGENS.ERRO_SERVIDOR);
        }
    }

    return (
        <div style={{ backgroundImage: `url(${fundo})` }} className="bg-cover bg-center py-24 pb-24">
            <div className="relative max-w-lg mx-auto p-8 border rounded-lg shadow bg-white">

                <div className="absolute top-4 right-4">
                    <BotaoSecundario onClick={sair}>
                        <LogOut />
                        Sair
                    </BotaoSecundario>
                </div>

                <div className="flex flex-col items-center text-center pt-8">
                    <Avatar foto={urlFotoPerfil(usuario.foto_perfil)} nome={usuario.nome} />
                    <h2 className="text-2xl font-bold mt-4">{usuario.nome}</h2>
                    <p className="text-gray-500">{usuario.email}</p>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                    {usuario?.role === "admin" && (
                        <BotaoPrimario onClick={() => navigate("/painel")}>
                            Acessar painel
                        </BotaoPrimario>
                    )}

                    <BotaoSecundario onClick={() => navigate("/editarPerfil")}>
                        <Pencil />
                        Editar perfil
                    </BotaoSecundario>

                </div>

                <div className="border-t mt-8 pt-6 flex justify-center">
                    <button
                        onClick={() => excluir(usuario.id_usuario)}
                        className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:underline"
                    >
                        <Trash2 size={16} />
                        Excluir minha conta
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Perfil;