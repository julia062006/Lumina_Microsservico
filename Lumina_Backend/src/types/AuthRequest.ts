import { Request } from "express";

export interface TokenPayload {
    id: number;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
        usuario?: TokenPayload;
}