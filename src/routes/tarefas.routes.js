// rotas de tarefas
const express = require("express");
const router = express.Router();

const tarefasController = require("../controllers/tarefas.controller");
router.get("/estatisticas", tarefasController.estatisticas);
router.get("/estatisticas/resumo", tarefasController.estatisticasResumo);
router.get("/", tarefasController.listarTarefas);
router.get("/:id", tarefasController.buscarPorId);
router.post("/", tarefasController.criarTarefa);
router.put("/:id", tarefasController.atualizarTarefa);
router.delete("/:id", tarefasController.deletarTarefa); 

module.exports = router;
