import { Request, Response } from "express";
import Editora from "../models/Editora";
import { invalidarPrefixo } from "../utils/cache";

class EditoraController {
    static async findAll(req: Request, res: Response) {
        try {
            const editoras = await Editora.findAll({
                order: [["id_editora", "DESC"]]
            });

            return res.status(200).json(editoras);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const editora = await Editora.findByPk(Number(id));

            if (!editora) {
                return res.status(404).json({ mensagem: "Editora não encontrada" });
            }
            return res.status(200).json(editora);
        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { nome, descricao } = req.body;

            const editora = await Editora.create({
                nome,
                descricao
            });

            return res.status(201).json(editora);

        } catch (erro) {
            return res.status(500).json({
                mensagem: "Erro interno do servidor"
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const { nome, descricao } = req.body;

            const editora = await Editora.findByPk(Number(id));

            if (!editora) {
                return res.status(404).json({ mensagem: "Editora não encontrada" });
            }

            await editora.update({
                nome,
                descricao
            });
            await invalidarPrefixo("livros:");
            return res.status(200).json({ mensagem: "Editora atualizada com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const editora = await Editora.findByPk(Number(id));

            if (!editora) {
                return res.status(404).json({ mensagem: "Editora não encontrada" });
            }

            await editora.destroy();
            await invalidarPrefixo("livros:");
            return res.status(200).json({ mensagem: "Editora removida com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

}

export default EditoraController;