// rotas de usuários
const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuarios.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

router.get("/", usuariosController.listarUsuarios);
router.get("/:id", usuariosController.buscarUsuarioPorId);
router.post("/", validar(schemas.usuario), usuariosController.criarUsuario);
router.put(
  "/:id",
  validar(schemas.usuario),
  usuariosController.atualizarUsuario,
);
router.delete("/:id", usuariosController.deletarUsuario);

module.exports = router;
