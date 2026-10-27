import { useNavigate } from "react-router-dom";
import { BotaoPrimario, BotaoSecundario } from "../../../componentes/Botao";
import Tabela from "../../../componentes/Tabela";
import Paginacao from "../../../componentes/Paginacao";
import { MENSAGENS } from "../../../utilitarios/validacoes";
import { alertaConfirmacao, alertaSucesso, alertaErro } from "../../../utilitarios/formulario";
import { useLivros } from "./useLivros";

function ListarLivros() {
    const navigate = useNavigate();
    const { livrosPaginados, totalPaginas, paginaAtual, setPaginaAtual, excluirLivro } = useLivros();

    async function excluir(id) {
        const resultado = await alertaConfirmacao();
        if (!resultado.isConfirmed) return;

        try {
            await excluirLivro(id);
            await alertaSucesso("Livro removido com sucesso!");
        } catch (erro) {
            await alertaErro(MENSAGENS.ERRO_SERVIDOR);
        }
    }

    return (
        <div className="bg-blue-50 pt-10 pb-16">
            <div className="max-w-4xl mx-auto mt-10 px-4 pb-16 bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">LIVROS</h1>
                    <div className="flex gap-2">
                        <BotaoPrimario onClick={() => navigate("/painel/cadastroLivro")}>
                            Cadastrar
                        </BotaoPrimario>
                        <BotaoSecundario type="button" onClick={() => navigate("/painel")}>
                            Voltar
                        </BotaoSecundario>
                    </div>
                </div>

                <Tabela
                    colunas={["Título", "Autor", "Preço", "Destaque"]}
                    dados={livrosPaginados}
                    renderLinha={(livro) => (
                        <>
                            <td className="px-4 py-2">{livro.titulo}</td>
                            <td className="px-4 py-2">{livro.autor?.nome}</td>
                            <td className="px-4 py-2">{livro.destaque === true || livro.destaque === "true" ? "Sim" : "Não"}</td>
                        </>
                    )}
                    renderAcoes={(livro) => (
                        <>
                            <BotaoSecundario onClick={() => { navigate(`/painel/editarLivro/${livro.id_livro}`, { state: { livro } }) }}>
                                Editar
                            </BotaoSecundario>
                            <button
                                onClick={() => excluir(livro.id_livro)}
                                className="text-red-500 hover:underline text-sm"
                            >
                                Excluir
                            </button>
                        </>
                    )}
                />

                <Paginacao
                    totalPaginas={totalPaginas}
                    paginaAtual={paginaAtual}
                    onMudarPagina={setPaginaAtual}
                />
            </div>
        </div>
    );
}

export default ListarLivros;