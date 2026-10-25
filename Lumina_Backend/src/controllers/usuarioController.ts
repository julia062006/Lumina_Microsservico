import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import Role from "../models/Role";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

class UsuarioController {
    static async findAll(req: Request, res: Response) {
        try {
            const usuario = await Usuario.findAll({
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id_role", "nome"]
                    }
                ],
                order: [["id_usuario", "DESC"]]
            });

            return res.send(usuario);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(Number(id), {
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id_role", "nome"]
                    }
                ]
            });

            if (!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            return res.status(200).json(usuario);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async create(req: Request, res: Response) {

        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() });
        }

        try {
            const { nome, email, senha, cpf } = req.body;

            const cpfLimpo = cpf.replace(/\D/g, "");

            const senhaHash = await bcrypt.hash(senha, 10);

            const foto_perfil = req.file ? req.file.filename : null;

            const roleUser = await Role.findOne({
                where: {
                    nome: "user"
                }
            });

            if (!roleUser) {
                return res.status(500).json({
                    mensagem: "Role padrão não encontrada"
                });
            }

            const usuario = await Usuario.create({
                nome,
                email,
                senha: senhaHash,
                cpf: cpfLimpo,
                id_role: roleUser.id_role,
                foto_perfil
            });

            return res.status(201).json({
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                role: roleUser.nome,
                foto_perfil: usuario.foto_perfil
            });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Não foi possível realizar o cadastro, verifique os campos preenchidos.", erro });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() });
        }

        try {
            const { id } = req.params;

            if (Number(id) !== req.usuario!.id) {
                return res.status(403).json({ mensagem: "Acesso negado" });
            }

            const { nome, senha, cpf } = req.body;

            const usuario = await Usuario.findByPk(Number(id), {
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id_role", "nome"]
                    }
                ]
            });

            if (!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            const foto_perfil = req.file ? req.file.filename : usuario.foto_perfil;

            if (!cpf && !nome && !senha && !req.file) {
                return res.status(400).json({
                    mensagem: "Nenhum dado foi enviado para atualização"
                });
            }

            let senhaHash = usuario.senha;

            if (senha) {
                senhaHash = await bcrypt.hash(senha, 10);
            }

            const cpfLimpo = cpf ? cpf.replace(/\D/g, "") : usuario.cpf;

            if (cpf && !cpfValidator.isValid(cpfLimpo)) {
                return res.status(400).json({ mensagem: "CPF inválido" });
            }

            await usuario.update({
                nome,
                senha: senhaHash,
                cpf: cpfLimpo,
                foto_perfil
            });

            return res.status(200).json({
                mensagem: "Usuário atualizado com sucesso",
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                role: usuario.role?.nome,
                foto_perfil: usuario.foto_perfil
            });

        } catch (erro) {
            console.error("Erro no update:", erro);
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async remove(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(Number(id));

            if (!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            const DonoDaConta = Number(id) === req.usuario!.id;
            const Admin = req.usuario!.role === "admin";

            if (!DonoDaConta && !Admin) {
                return res.status(403).json({ mensagem: "Acesso negado" });
            }

            await usuario.destroy();
            return res.status(200).json({ mensagem: "Usuário removido com sucesso" });

        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    mensagem: "Email e senha são obrigatórios"
                });
            }

            const usuario = await Usuario.findOne({
                where: { email },
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id_role", "nome"]
                    }
                ]
            });

            if (!usuario) {
                return res.status(401).json({
                    mensagem: "Email ou senha inválidos"
                });
            }

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (!senhaCorreta) {
                return res.status(401).json({
                    mensagem: "Email ou senha inválidos"
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id_usuario,
                    email: usuario.email,
                    role: usuario.role!.nome
                },
                process.env.SECRET as string
            );

            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    cpf: usuario.cpf,
                    role: usuario.role!.nome,
                    foto_perfil: usuario.foto_perfil
                }
            });

        } catch (erro) {
            console.error("Erro no login:", erro);

            return res.status(500).json({
                mensagem: "Erro interno do servidor"
            });
        }
    }

    static async perfil(req: AuthRequest, res: Response) {
        try {
            const usuario = await Usuario.findByPk(req.usuario!.id, {
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id_role", "nome"]
                    }
                ]
            });

            if (!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            return res.json({
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                role: usuario.role!.nome,
                foto_perfil: usuario.foto_perfil
            });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }
}

export default UsuarioController;