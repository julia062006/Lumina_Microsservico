import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { criarCategoria } from "../../../services/api";
import { BotaoPrimario, BotaoSecundario } from "../../../componentes/Botao";
import Input from "../../../componentes/Input";
import Formulario from "../../../componentes/Formulario";
import { validacoesTexto, MENSAGENS, validacoesSelect } from "../../../utilitarios/validacoes";
import { alertaSucesso, alertaErro } from "../../../utilitarios/formulario";

function CadastrarCategoria() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    async function cadastrar(dados) {
        try {
            const resposta = await criarCategoria({
                nome: dados.nome,
                descricao: dados.descricao,
                destaque: dados.destaque
            });

            if (!resposta.ok) {
                await alertaErro(resposta.data.mensagem);
                return;
            }

            await alertaSucesso(MENSAGENS.CADASTRO_SUCESSO("Categoria"));
            reset();

        } catch (erro) {
            console.error(MENSAGENS.ERRO_SERVIDOR, erro);
            await alertaErro(MENSAGENS.ERRO_SERVIDOR);
            console.log(erro);

        }
    }

    return (
        <div className="bg-purple-50">
            <Formulario titulo="Cadastrar Categoria" onSubmit={handleSubmit(cadastrar)}>

                <Input
                    label="Nome"
                    name="nome"
                    placeholder="Digite o nome da categoria"
                    register={(name) => register(name, validacoesTexto("O nome é obrigatório"))}
                    error={errors.nome}
                />

                <Input
                    label="Descrição"
                    name="descricao"
                    placeholder="Digite a descrição da categoria"
                    register={(name) => register(name, validacoesTexto("A descrição é obrigatória"))}
                    error={errors.descricao}
                />

                <div className="mt-4">
                    <label>Destaque</label>
                    <select
                        {...register("destaque", validacoesSelect("Destaque é obrigatório"))}
                        className="block w-full mt-2 border p-2"
                    >
                        <option value="">Selecione</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                    {errors.destaque && <p>{errors.destaque.message}</p>}
                </div>

                <div className="flex gap-4 mt-4">
                    <BotaoPrimario type="submit">Cadastrar</BotaoPrimario>
                    <BotaoSecundario type="button" onClick={() => navigate("/painel/categorias")}>
                        Voltar
                    </BotaoSecundario>
                </div>

            </Formulario>
        </div>
    );
}

export default CadastrarCategoria;