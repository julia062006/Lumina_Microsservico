import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { atualizarUsuarioComFoto } from "../services/api";
import { BotaoPrimario, BotaoSecundario } from "../componentes/Botao";
import Input from "../componentes/Input";
import Formulario from "../componentes/Formulario";
import InputSenha from "../componentes/InputSenha";
import InputFotoPerfil from "../componentes/InputFotoPerfil";
import { useUsuario } from "../contexto/UsuarioContexto";
import { mascaraCPF, urlFotoPerfil } from "../utilitarios/formatadores";
import { validacoesNome, validacoesSenha, validacoesConfirmarSenha, validacoesCPF, MENSAGENS } from "../utilitarios/validacoes";
import { alertaSucesso, alertaErro, tratarErrosResposta } from "../utilitarios/formulario";
import fundo from "../imagens/planofundo2.png";

function prepararDados(dados, fotoPerfil) {
    const formData = new FormData();

    formData.append("nome", dados.nome);
    formData.append("cpf", dados.cpf.replace(/\D/g, ""));

    if (dados.senha) {
        formData.append("senha", dados.senha);
        formData.append("confirmarSenha", dados.confirmarSenha);
    }

    if (fotoPerfil) {
        formData.append("foto_perfil", fotoPerfil);
    }

    return formData;
}

function EditarPerfil() {
    const { usuario, atualizarUsuarioContexto } = useUsuario();
    const navigate = useNavigate();
    const [fotoPerfil, setFotoPerfil] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm();

    const getSenha = () => watch("senha");

    useEffect(() => {
        if (!usuario) {
            navigate("/entrar");
            return;
        }

        setValue("nome", usuario.nome);
        setValue("email", usuario.email);
        setValue("cpf", mascaraCPF(usuario.cpf));
    }, [usuario, navigate, setValue]);

    async function salvar(dados) {
        try {
            const dadosAtualizados = prepararDados(dados, fotoPerfil);
            const resposta = await atualizarUsuarioComFoto(usuario.id_usuario, dadosAtualizados);

            if (!resposta.ok) {
                tratarErrosResposta(resposta, setError);
                return;
            }

            await atualizarUsuarioContexto();
            await alertaSucesso(MENSAGENS.ATUALIZADO_SUCESSO);
            navigate("/perfil");

        } catch (erro) {
            console.error("Erro ao atualizar usuário:", erro);
            await alertaErro(MENSAGENS.ERRO_SERVIDOR);
        }
    }

    if (!usuario) return null;

    return (
        <div style={{
            backgroundImage: `url(${fundo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }} className="min-h-screen">
            <div>
                <Formulario onSubmit={handleSubmit(salvar)}>

                    <InputFotoPerfil
                        fotoAtual={urlFotoPerfil(usuario.foto_perfil)}
                        nome={usuario.nome}
                        aoSelecionar={setFotoPerfil}
                    />

                    <Input
                        label="Nome"
                        name="nome"
                        register={(name) => register(name, validacoesNome)}
                        error={errors.nome}
                    />

                    <Input
                        label="CPF"
                        name="cpf"
                        register={(name) => register(name, validacoesCPF)}
                        error={errors.cpf}
                    />

                    <Input
                        label="Email"
                        name="email"
                        register={(name) => register(name)}
                        error={errors.email}
                        disabled
                    />

                    <p className="text-sm text-gray-500 -mt-2">
                        O email não pode ser alterado
                    </p>

                    <InputSenha
                        label="Nova Senha"
                        name="senha"
                        placeholder="Digite a nova senha (opcional)"
                        register={(name) => register(name, validacoesSenha(true))}
                        error={errors.senha}
                    />

                    <InputSenha
                        label="Confirmar Nova Senha"
                        name="confirmarSenha"
                        placeholder="Confirme a nova senha"
                        register={(name) => register(name, validacoesConfirmarSenha(getSenha))}
                        error={errors.confirmarSenha}
                    />

                    <div className="flex gap-4 mt-4 items-center">
                        <BotaoPrimario type="submit">Salvar</BotaoPrimario>
                        <BotaoSecundario type="button" onClick={() => navigate("/perfil")}>
                            Cancelar
                        </BotaoSecundario>
                    </div>

                </Formulario>
            </div>
        </div>
    );
}

export default EditarPerfil;