import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";

export function AutorizarRoles(...rolesPermitidas: string[]) {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.usuario) {
            return res.status(401).json({
                mensagem: "Não autenticado"
            });
        }

        if (!rolesPermitidas.includes(req.usuario.role)) {
            return res.status(403).json({
                mensagem: "Acesso negado"
            });
        }

        return next();
    };
}