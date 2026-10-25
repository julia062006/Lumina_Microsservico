import { Request, Response } from "express";
import Livro from "../models/Livro";
import { validationResult } from "express-validator";
import { WhereOptions } from "sequelize";
import path from "node:path";
import fs from "fs";

class LivroController {

    static async findAll(req: Request, res: Response) {
        try {
            const { categoria, colecao } = req.query;

            const where: WhereOptions = {};

            if (categoria) {
                where.id_categoria = Number(categoria);
            }

            if (colecao) {
                where.id_colecao = Number(colecao);
            }

            const livro = await Livro.findAll({
                where,
                order: [["id_livro", "DESC"]],
                include: [
                    { association: "autor" },
                    { association: "categoria" },
                    { association: "editora" },
                    { association: "colecao" }
                ]
            });

            return res.send(livro);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(Number(id), {
                include: [
                    { association: "autor" },
                    { association: "categoria" },
                    { association: "editora" },
                    { association: "colecao" }
                ]
            });
            if (!livro) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            return res.status(200).json(livro);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async create(req: Request, res: Response) {
        try {

            const { id_autor, titulo, descricao, id_categoria, destaque, id_editora, id_colecao } = req.body;

            const arquivos = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            const capa = arquivos?.["capa_imagem"]?.[0];
            const pdf = arquivos?.["arquivo_pdf"]?.[0];

            if (!capa || !pdf) {
                return res.status(400).json({
                    mensagem: "Arquivos obrigatórios"
                });
            }

            const livro = await Livro.create({
                id_autor,
                titulo,
                descricao,
                id_categoria,
                id_editora,
                id_colecao: id_colecao || null,
                capa_imagem: capa.filename,
                arquivo_pdf: pdf.filename,
                destaque: destaque === "true",
            });

            return res.status(201).json(livro);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async update(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() });
        }
        try {
            const { id } = req.params;
            const { id_autor, titulo, descricao, id_categoria, destaque, id_editora, id_colecao } = req.body;
            const livro = await Livro.findByPk(Number(id));

            if (!livro) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            const arquivos = req.files as { [fieldname: string]: Express.Multer.File[] };

            const capa_imagem = arquivos?.["capa_imagem"]?.[0]?.filename ?? livro.capa_imagem;
            const arquivo_pdf = arquivos?.["arquivo_pdf"]?.[0]?.filename ?? livro.arquivo_pdf;

            await livro.update({
                id_autor,
                titulo,
                descricao,
                capa_imagem,
                arquivo_pdf,
                id_categoria,
                id_editora,
                id_colecao: id_colecao || null,
                destaque: destaque === "true"
            });

            return res.status(200).json({ mensagem: "Livro atualizado com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(Number(id));

            if (!livro) {
                return res.status(404).json({ mensagem: "Livro não encontrado" });
            }

            await livro.destroy();
            return res.status(200).json({ mensagem: "Livro removido com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async getDestaques(req: Request, res: Response) {
        try {
            const livros = await Livro.findAll({
                where: { destaque: true },
                include: [
                    { association: "autor" },
                    { association: "categoria" },
                    { association: "editora" },
                    { association: "colecao" }
                ]
            });

            return res.status(200).json(livros);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async abrirPdf(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const livro = await Livro.findByPk(Number(id));

            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }

            const caminhoPdf = path.resolve("uploads", livro.arquivo_pdf);

            if (!fs.existsSync(caminhoPdf)) {
                return res.status(404).json({ erro: "Arquivo não encontrado" });
            }

            return res.sendFile(caminhoPdf);

        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao abrir PDF" });
        }
    }
}

export default LivroController;