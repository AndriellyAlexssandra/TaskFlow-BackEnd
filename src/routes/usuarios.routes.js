// rotas de usuários
const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuarios.controller");
router.get("/", usuariosController.listarUsuarios);
router.get("/:id", usuariosController.buscarPorId);
router.post("/", usuariosController.criarUsuario);
router.put("/:id", usuariosController.atualizarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);

module.exports = router;
