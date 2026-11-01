import { NextFunction, Request, Response } from "express";

export function AutenticarChaveInterna(req: Request, res: Response, next: NextFunction) {
    const chave = req.headers["x-api-key"];
    const esperada = process.env.INTERNAL_API_KEY;

    console.log("[INTERNAL] header recebido:", chave ? `len=${String(chave).length}` : "ausente",
        "| variável no backend:", esperada ? `len=${esperada.length}` : "NÃO DEFINIDA");

    if (!esperada || chave !== esperada) {
        return res.status(401).json({ mensagem: "Chave interna inválida" });
    }
    next();
}