// rotas de tarefas
const express = require("express");
const router = express.Router();

const tarefasController = require("../controllers/tarefas.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

router.get("/estatisticas", tarefasController.estatisticas);
router.get("/estatisticas/resumo", tarefasController.estatisticasResumo);
router.get("/", tarefasController.listarTarefas);
router.get("/:id", tarefasController.buscarTarefaPorId);
router.post("/", validar(schemas.tarefa), tarefasController.criarTarefa);
router.put("/:id", validar(schemas.tarefa), tarefasController.atualizarTarefa);
router.delete("/:id", tarefasController.deletarTarefa); 

module.exports = router;
