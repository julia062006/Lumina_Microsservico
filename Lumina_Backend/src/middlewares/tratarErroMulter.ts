import { NextFunction, Request, Response } from "express";
import multer from "multer";

export function tratarErroMulter(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ erro: err.message });
    }

    if (err) {
        return res.status(400).json({ erro: err.message });
    }

    next();
}