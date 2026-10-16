// rotas de usuários
const express = require("express");

const usuariosController = require("../controllers/usuarios.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const router = express.Router();
const idValido = validar(schemas.id, "params");

router.get("/", usuariosController.listarUsuarios);

router.get("/:id", idValido, usuariosController.buscarUsuarioPorId);

router.post("/", validar(schemas.usuario), usuariosController.criarUsuario);

router.put(
  "/:id",
  idValido,
  validar(schemas.usuario),
  usuariosController.atualizarUsuario,
);
router.delete("/:id", idValido, usuariosController.deletarUsuario);

module.exports = router;
