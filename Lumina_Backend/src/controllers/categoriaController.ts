import { Request, Response } from "express";
import Categoria from "../models/Categoria";
import { validationResult } from "express-validator";

class CategoriaController {
  static async findAll(req: Request, res: Response) {
    try {
      const categoria = await Categoria.findAll({
        order: [["id_categoria", "DESC"]]
      });
      return res.send(categoria);
    } catch (erro) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  static async findDestaque(req: Request, res: Response) {
    try {
      const categorias = await Categoria.findAll({
        where: { destaque: 1 },
      });
      return res.status(200).json(categorias);
    } catch (erro) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(Number(id));
      if (!categoria) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
      }

      return res.status(200).json(categoria);
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
      const { nome, descricao, destaque } = req.body;

      if (!nome || !descricao) {
        return res.status(400).json({
          mensagem: "Nome e descrição são obrigatórios"
        });
      }

      const categoria = await Categoria.create({
        nome: nome,
        descricao: descricao,
        destaque: destaque ?? false
      });
      return res.status(201).json(categoria);
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
      const { nome, descricao, destaque } = req.body;
      const categoria = await Categoria.findByPk(Number(id));

      if (!categoria) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
      }

      await categoria.update({
        nome,
        descricao,
        destaque
      });
      return res
        .status(200)
        .json({ mensagem: "Categoria atualizada com sucesso" });
    } catch (erro) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(Number(id));

      if (!categoria) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
      }

      await categoria.destroy();
      return res
        .status(200)
        .json({ mensagem: "Categoria removida com sucesso" });
    } catch (erro) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
}

export default CategoriaController;
