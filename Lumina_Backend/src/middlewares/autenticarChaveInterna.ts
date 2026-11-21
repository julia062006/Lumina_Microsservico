import { NextFunction, Request, Response } from "express";

export function AutenticarChaveInterna(req: Request, res: Response, next: NextFunction) {
    const chave = req.headers["x-api-key"];
    const esperada = process.env.INTERNAL_API_KEY;

    if (!esperada || chave !== esperada) {
        console.warn(`[INTERNAL] Acesso negado em ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ mensagem: "Chave interna inválida" });
    }
    next();
}