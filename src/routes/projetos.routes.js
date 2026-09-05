const express = require("express");
const router = express.Router();

const projetosController = require("../controllers/projetos.controller");
router.get("/", projetosController.listarProjetos);

router.get("/:id/resumo", projetosController.resumoProjeto);
router.get("/:id", projetosController.buscarProjetoPorId);
router.post("/", projetosController.postarProjetos);
router.put("/:id", projetosController.atualizarProjetos);
router.delete("/:id", projetosController.deletarProjetos);

module.exports = router;

