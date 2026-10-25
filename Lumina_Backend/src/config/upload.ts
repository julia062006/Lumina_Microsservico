import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname);
        const nomeArquivo = Date.now() + extensao;

        cb(null, nomeArquivo);
    }
});

function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    const tiposImagemPermitidos = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (
        file.fieldname === "foto" ||
        file.fieldname === "capa_imagem"
    ) {
        if (!tiposImagemPermitidos.includes(file.mimetype)) {
            return cb(
                new Error(
                    "O arquivo deve ser uma imagem (JPEG, JPG, PNG ou WEBP)"
                )
            );
        }
    }

    if (file.fieldname === "arquivo_pdf") {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Arquivo do livro deve ser um PDF"));
        }
    }

    cb(null, true);
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
