const express = require("express");
const router = express.Router();

const projetosController = require("../controllers/projetos.controller");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const idValido = validar(schemas.id, "params");

router.get("/", projetosController.listarProjetos);

router.get("/:id/resumo", idValido, projetosController.resumoProjeto);
router.get("/:id", idValido, projetosController.buscarProjetoPorId);
router.post("/", validar(schemas.projeto), projetosController.postarProjetos);

router.put(
  "/:id",
  idValido,
  validar(schemas.projeto),
  projetosController.atualizarProjetos,
);
router.delete("/:id", idValido, projetosController.deletarProjetos);

module.exports = router;
