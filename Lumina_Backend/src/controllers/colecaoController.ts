import { Request, Response } from "express";
import Colecao from "../models/Colecao";
import { invalidarPrefixo } from "../utils/cache";

class ColecaoController {

    static async findAll(req: Request, res: Response) {
        try {
            const colecoes = await Colecao.findAll({
                order: [["id_colecao", "DESC"]]
            });

            return res.status(200).json(colecoes);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const colecao = await Colecao.findByPk(Number(id));

            if (!colecao) {
                return res.status(404).json({ mensagem: "Coleção não encontrada" });
            }

            return res.status(200).json(colecao);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async create(req: Request, res: Response) {
        try {

            const { nome, descricao } = req.body;

            const colecao = await Colecao.create({
                nome,
                descricao
            });

            return res.status(201).json(colecao);

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async update(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const { nome, descricao } = req.body;

            const colecao = await Colecao.findByPk(Number(id));

            if (!colecao) {
                return res.status(404).json({ mensagem: "Coleção não encontrada" });
            }

            await colecao.update({
                nome,
                descricao
            });
            await invalidarPrefixo("livros:");
            return res.status(200).json({ mensagem: "Coleção atualizada com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }

    static async remove(req: Request, res: Response) {
        try {

            const { id } = req.params;

            const colecao = await Colecao.findByPk(Number(id));

            if (!colecao) {
                return res.status(404).json({ mensagem: "Coleção não encontrada" });
            }

            await colecao.destroy();
            await invalidarPrefixo("livros:");
            return res.status(200).json({ mensagem: "Coleção removida com sucesso" });

        } catch (erro) {
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    }
}

export default ColecaoController;