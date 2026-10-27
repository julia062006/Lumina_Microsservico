import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { criarLivro, getAutores, getCategorias, getEditoras, getColecoes } from "../../../services/api";
import { BotaoPrimario, BotaoSecundario } from "../../../componentes/Botao";
import Input from "../../../componentes/Input";
import Formulario from "../../../componentes/Formulario";
import { validacoesTexto, validacoesSelect, MENSAGENS } from "../../../utilitarios/validacoes";
import { criarFormData, alertaSucesso, alertaErro } from "../../../utilitarios/formulario";


function CadastrarLivro() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const [capa, setCapa] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [editoras, setEditoras] = useState([]);
    const [colecoes, setColecoes] = useState([]);

    useEffect(() => {
        async function carregarDados() {
            const [respostaAutores, respostaCategorias, respostaEditoras, respostaColecoes] = await Promise.all([
                getAutores(),
                getCategorias(),
                getEditoras(),
                getColecoes(),
            ]);

            if (respostaAutores.ok) setAutores(respostaAutores.data);
            if (respostaCategorias.ok) setCategorias(respostaCategorias.data);
            if (respostaEditoras.ok) setEditoras(respostaEditoras.data);
            if (respostaColecoes.ok) setColecoes(respostaColecoes.data);
        }

        carregarDados();
    }, []);

    async function cadastrar(dados) {
        try {
            const formData = criarFormData({
                titulo: dados.titulo,
                descricao: dados.descricao,
                id_autor: dados.id_autor,
                id_categoria: dados.id_categoria,
                id_editora: dados.id_editora,
                id_colecao: dados.id_colecao || null,
                destaque: dados.destaque,
                capa_imagem: capa,
                arquivo_pdf: pdf,
            });

            const resposta = await criarLivro(formData);

            if (!resposta.ok) {
                await alertaErro(resposta.data.mensagem);
                return;
            }

            await alertaSucesso(MENSAGENS.CADASTRO_SUCESSO("Livro"));
            reset();
            setCapa(null);
            setPdf(null);

        } catch (erro) {
            console.error(MENSAGENS.ERRO_SERVIDOR, erro);
            await alertaErro(MENSAGENS.ERRO_SERVIDOR);
        }
    }

    return (
        <div className="bg-blue-50">
            <Formulario titulo="Cadastrar Livro" onSubmit={handleSubmit(cadastrar)}>

                <Input
                    label="Título"
                    name="titulo"
                    placeholder="Digite o título"
                    register={(name) => register(name, validacoesTexto("O título é obrigatório"))}
                    error={errors.titulo}
                />

                <Input
                    label="Descrição"
                    name="descricao"
                    placeholder="Digite a descrição"
                    register={(name) => register(name, validacoesTexto("A descrição é obrigatória"))}
                    error={errors.descricao}
                />

                <div className="mt-4">
                    <label>Autor</label>
                    <select
                        {...register("id_autor", validacoesSelect("Autor é obrigatório"))}
                        className="block w-full mt-2 border p-2"
                    >
                        <option value="">Selecione um autor</option>
                        {autores.map((autor) => (
                            <option key={autor.id_autor} value={autor.id_autor}>
                                {autor.nome}
                            </option>
                        ))}
                    </select>
                    {errors.id_autor && <p>{errors.id_autor.message}</p>}
                </div>

                <div className="mt-4">
                    <label>Categoria</label>
                    <select
                        {...register("id_categoria", validacoesSelect("Categoria é obrigatória"))}
                        className="block w-full mt-2 border p-2"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                    {errors.id_categoria && <p>{errors.id_categoria.message}</p>}
                </div>

                <div className="mt-4">
                    <label>Editora</label>
                    <select
                        {...register("id_editora", validacoesSelect("Editora é obrigatória"))}
                        className="block w-full mt-2 border p-2"
                    >
                        <option value="">Selecione uma editora</option>
                        {editoras.map((editora) => (
                            <option key={editora.id_editora} value={editora.id_editora}>
                                {editora.nome}
                            </option>
                        ))}
                    </select>
                    {errors.id_editora && <p>{errors.id_editora.message}</p>}
                </div>

                <div className="mt-4">
                    <label>Coleção</label>
                    <select
                        {...register("id_colecao")}
                        className="block w-full mt-2 border p-2"
                    >
                        <option value="">Nenhuma coleção</option>
                        {colecoes.map((colecao) => (
                            <option key={colecao.id_colecao} value={colecao.id_colecao}>
                                {colecao.nome}
                            </option>
                        ))}
                    </select>
                </div>

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

                <div className="mt-4">
                    <label>Capa do Livro</label>
                    <input
                        type="file"
                        name="capa_imagem"
                        accept="image/*"
                        onChange={(e) => setCapa(e.target.files[0])}
                        className="block mt-2"
                    />
                </div>

                {capa && (
                    <img
                        src={URL.createObjectURL(capa)}
                        alt="preview"
                        width="150"
                        className="mt-4"
                    />
                )}

                <div className="mt-4">
                    <label>Arquivo PDF</label>
                    <input
                        type="file"
                        name="arquivo_pdf"
                        accept="application/pdf"
                        onChange={(e) => setPdf(e.target.files[0])}
                        className="block mt-2"
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <BotaoPrimario type="submit">Cadastrar</BotaoPrimario>
                    <BotaoSecundario type="button" onClick={() => navigate("/painel/livros")}>
                        Voltar
                    </BotaoSecundario>
                </div>

            </Formulario>
        </div>
    );
}
 
export default CadastrarLivro;
