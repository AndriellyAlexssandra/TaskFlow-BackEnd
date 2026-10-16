// rotas de tarefas
const express = require("express");

const tarefasController = require("../controllers/tarefas.controller");
const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const router = express.Router();
const idValido = validar(schemas.id, "params");

router.get("/estatisticas", tarefasController.estatisticas);

router.get("/estatisticas/resumo", tarefasController.estatisticasResumo);

router.get("/", tarefasController.listarTarefas);

router.get("/:id", idValido, tarefasController.buscarTarefaPorId);

router.post("/", validar(schemas.tarefa), tarefasController.criarTarefa);

router.put(
  "/:id",
  idValido,
  validar(schemas.tarefa),
  tarefasController.atualizarTarefa,
);

router.delete("/:id", idValido, tarefasController.deletarTarefa);

module.exports = router;
