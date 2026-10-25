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

router.use(AutenticarToken);

router.get("/usuarios", AutorizarRoles("admin"), UsuarioController.findAll);
router.get("/usuarios/:id", AutorizarRoles("admin"), UsuarioController.getById);
router.delete("/usuarios/:id", UsuarioController.remove);
router.put("/usuarios/:id", upload.single("foto_perfil"), validarAtualizacaoUsuario, UsuarioController.update);
router.get("/perfil", UsuarioController.perfil);


router.get("/categorias", CategoriaController.findAll);
router.post("/categorias", AutenticarToken, CategoriaController.create);
router.get("/categorias/destaque", CategoriaController.findDestaque);
router.get("/categorias/:id", CategoriaController.getById);
router.delete("/categorias/:id", AutorizarRoles("admin"), CategoriaController.remove);
router.put("/categorias/:id", AutorizarRoles("admin"), CategoriaController.update);


router.get("/autores", AutorController.findAll);
router.post("/autores", upload.single("foto"), AutorizarRoles("admin"), AutorController.create);
router.get("/autores/:id", AutorController.getById);
router.delete("/autores/:id", AutorizarRoles("admin"), AutorController.remove);
router.put("/autores/:id", upload.single("foto"), AutorizarRoles("admin"), AutorController.update);
router.get("/autores/:id/livros", AutorController.findByAutor);


router.get("/livros", LivroController.findAll);
router.post("/livros", upload.fields([{ name: "capa_imagem", maxCount: 1 }, { name: "arquivo_pdf", maxCount: 1 }]), AutorizarRoles("admin"), LivroController.create);
router.get("/livros/destaque", LivroController.getDestaques);
router.get("/livros/:id", LivroController.getById);
router.delete("/livros/:id", AutorizarRoles("admin"), LivroController.remove);
router.put("/livros/:id", upload.fields([{ name: "capa_imagem", maxCount: 1 }, { name: "arquivo_pdf", maxCount: 1 }]), AutorizarRoles("admin"), LivroController.update);
router.get("/livros/:id/pdf", LivroController.abrirPdf);


router.get("/editoras", EditoraController.findAll);
router.get("/editoras/:id", EditoraController.getById);
router.post("/editoras", AutorizarRoles("admin"), EditoraController.create);
router.put("/editoras/:id", AutorizarRoles("admin"), EditoraController.update);
router.delete("/editoras/:id", AutorizarRoles("admin"), EditoraController.remove);


router.get("/colecoes", ColecaoController.findAll);
router.get("/colecoes/:id", ColecaoController.getById);
router.post("/colecoes", AutorizarRoles("admin"), ColecaoController.create);
router.put("/colecoes/:id", AutorizarRoles("admin"), ColecaoController.update);
router.delete("/colecoes/:id", AutorizarRoles("admin"), ColecaoController.remove);

export default router;