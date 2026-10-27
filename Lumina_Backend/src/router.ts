
import { Router } from "express";
import UsuarioController from "./controllers/usuarioController";
import CategoriaController from "./controllers/categoriaController";
import AutorController from "./controllers/autorController";
import { AutenticarToken } from "./middlewares/autenticarToken";
import upload from "./config/upload";
import LivroController from "./controllers/livroController";
import { validarAtualizacaoUsuario, validarUsuario } from "./middlewares/validarUsuario";
import { validarErros } from "./middlewares/validarErros";
import EditoraController from "./controllers/editoraController";
import ColecaoController from "./controllers/colecaoController";
import { AutorizarRoles } from "./middlewares/autorizarRole";

const router = Router();

router.post("/usuarios", upload.single("foto_perfil"), validarUsuario, validarErros, UsuarioController.create);
router.post("/entrar", UsuarioController.login);

router.get("/usuarios", AutenticarToken, AutorizarRoles("admin"), UsuarioController.findAll);
router.get("/usuarios/:id", AutenticarToken, AutorizarRoles("admin"), UsuarioController.getById);
router.delete("/usuarios/:id", AutenticarToken, AutorizarRoles("admin"), UsuarioController.remove);
router.put("/usuarios/:id", AutenticarToken, upload.single("foto_perfil"), validarAtualizacaoUsuario, validarErros, UsuarioController.update);
router.get("/perfil", AutenticarToken, UsuarioController.perfil);


router.get("/categorias", CategoriaController.findAll);
router.post("/categorias", AutenticarToken, AutorizarRoles("admin"), CategoriaController.create);
router.get("/categorias/destaque", CategoriaController.findDestaque);
router.get("/categorias/:id", CategoriaController.getById);
router.delete("/categorias/:id", AutenticarToken, AutorizarRoles("admin"), CategoriaController.remove);
router.put("/categorias/:id", AutenticarToken, AutorizarRoles("admin"), CategoriaController.update);


router.get("/autores", AutorController.findAll);
router.post("/autores", AutenticarToken, AutorizarRoles("admin"), upload.single("foto"), AutorController.create);
router.get("/autores/:id", AutorController.getById);
router.delete("/autores/:id", AutenticarToken, AutorizarRoles("admin"), AutorController.remove);
router.put("/autores/:id", AutenticarToken, AutorizarRoles("admin"), upload.single("foto"), AutorController.update);
router.get("/autores/:id/livros", AutorController.findByAutor);


router.get("/livros", LivroController.findAll);
router.post("/livros", AutenticarToken, AutorizarRoles("admin"), upload.fields([{ name: "capa_imagem", maxCount: 1 }, { name: "arquivo_pdf", maxCount: 1 }]), LivroController.create);
router.get("/livros/destaque", LivroController.getDestaques);
router.get("/livros/:id", LivroController.getById);
router.delete("/livros/:id", AutenticarToken, AutorizarRoles("admin"), LivroController.remove);
router.put("/livros/:id", AutenticarToken, AutorizarRoles("admin"), upload.fields([{ name: "capa_imagem", maxCount: 1 }, { name: "arquivo_pdf", maxCount: 1 }]), LivroController.update);
router.get("/livros/:id/pdf", AutenticarToken, LivroController.abrirPdf);


router.get("/editoras", EditoraController.findAll);
router.get("/editoras/:id", EditoraController.getById);
router.post("/editoras", AutenticarToken, AutorizarRoles("admin"), EditoraController.create);
router.put("/editoras/:id", AutenticarToken, AutorizarRoles("admin"), EditoraController.update);
router.delete("/editoras/:id", AutenticarToken, AutorizarRoles("admin"), EditoraController.remove);


router.get("/colecoes", ColecaoController.findAll);
router.get("/colecoes/:id", ColecaoController.getById);
router.post("/colecoes", AutenticarToken, AutorizarRoles("admin"), ColecaoController.create);
router.put("/colecoes/:id", AutenticarToken, AutorizarRoles("admin"), ColecaoController.update);
router.delete("/colecoes/:id", AutenticarToken, AutorizarRoles("admin"), ColecaoController.remove);

export default router;
