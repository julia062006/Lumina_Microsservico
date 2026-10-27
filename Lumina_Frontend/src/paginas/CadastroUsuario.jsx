import { useForm } from "react-hook-form";
import { useState } from "react";
import { criarUsuario } from "../services/api";
import { BotaoPrimario, BotaoSecundario } from "../componentes/Botao";
import Input from "../componentes/Input";
import Formulario from "../componentes/Formulario";
import { useNavigate } from "react-router-dom";
import InputSenha from "../componentes/InputSenha";
import InputFotoPerfil from "../componentes/InputFotoPerfil";
import Swal from "sweetalert2";
import { validacoesCPF } from "../utilitarios/validacoes";
import { mascaraCPF } from "../utilitarios/formatadores";


function CadastroUsuario() {
    const { register, handleSubmit, setError, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [fotoPerfil, setFotoPerfil] = useState(null);

    async function cadastrar(dados) {
        try {
            const formData = new FormData();

            formData.append("nome", dados.nome);
            formData.append("cpf", dados.cpf.replace(/\D/g, ""));
            formData.append("email", dados.email);
            formData.append("senha", dados.senha);
            formData.append("confirmarSenha", dados.confirmarSenha);

            if (fotoPerfil) {
                formData.append("foto_perfil", fotoPerfil);
            }

            const resposta = await criarUsuario(formData);

            if (!resposta.ok) {

                if (resposta.data.erros) {
                    resposta.data.erros.forEach((erro) => {
                        setError(erro.path, {
                            type: "server",
                            message: erro.msg
                        });
                    });
                } else if (resposta.data.mensagem) {
                    Swal.fire({
                        icon: "error",
                        title: resposta.data.mensagem
                    });
                }

                return;
            }

            Swal.fire({
                icon: "success",
                title: "Cadastro realizado com sucesso!"
            });

            reset();
            setFotoPerfil(null);
            navigate("/entrar");

        } catch (erro) {
            console.error("Erro ao conectar com o servidor:", erro);
            Swal.fire({
                icon: "error",
                title: "Erro ao realizar cadastro",
                text: "Não foi possível conectar com o servidor."
            });
        }
    }

    return (
        <div className="bg-pink-50">
            <Formulario titulo="Faça seu Cadastro" onSubmit={handleSubmit(cadastrar)}>

                <InputFotoPerfil
                    nome={watch("nome")}
                    aoSelecionar={setFotoPerfil}
                />

                <Input
                    label="Nome"
                    name="nome"
                    placeholder="Digite seu nome"
                    register={(name) =>
                        register(name, {
                            required: "O nome é obrigatório",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" }
                        })
                    }
                    error={errors.nome}
                />

                <Input
                    label="CPF"
                    name="cpf"
                    placeholder="Digite seu CPF"
                    register={(name) => register(name, validacoesCPF)}
                    onChange={(e) => {
                        e.target.value = mascaraCPF(e.target.value);
                    }}
                    error={errors.cpf}
                />

                <Input
                    label="Email"
                    name="email"
                    placeholder="Digite seu email"
                    register={(name) =>
                        register(name, {
                            required: "O email é obrigatório",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email inválido"
                            }
                        })
                    }
                    error={errors.email}
                />

                <InputSenha
                    label="Senha"
                    name="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    register={(name) =>
                        register(name, {
                            required: "A senha é obrigatória",
                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                            pattern: {
                                value: /[A-Z]/,
                                message: "Deve ter pelo menos 1 letra maiúscula"
                            },
                            validate: {
                                temEspecial: (value) =>
                                    /[^A-Za-z0-9]/.test(value) ||
                                    "Deve ter pelo menos 1 caractere especial"
                            },
                            deps: ["confirmarSenha"]
                        })
                    }
                    error={errors.senha}
                />

                <InputSenha
                    label="Confirmar Senha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Confirme sua senha"
                    register={(name) =>
                        register(name, {
                            required: "Confirme sua senha",
                            validate: (value, formValues) =>
                                value === formValues.senha ||
                                "As senhas não são iguais!"
                        })
                    }
                    error={errors.confirmarSenha}
                />

                <div className="flex gap-4 mt-4 items-center">
                    <BotaoPrimario type="submit">
                        Cadastrar
                    </BotaoPrimario>

                    <BotaoSecundario type="button" onClick={() => navigate("/entrar")}>
                        Já tenho uma conta
                    </BotaoSecundario>

                </div>

            </Formulario>
        </div>
    )

}

export default CadastroUsuario;