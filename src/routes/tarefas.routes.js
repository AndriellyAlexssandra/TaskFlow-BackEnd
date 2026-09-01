// rotas de tarefas
const express = require("express");
const router = express.Router();

function encontrarComum(objetoContagem) {
  const entradas = Object.entries(objetoContagem);
  if (entradas.length === 0) return null;

  entradas.sort((a, b) => b[1] - a[1]);
  return entradas[0][0];
}

router.get("/resumo", (req, res) => {
  const { coluna } = req.query;

  const tarefasFiltradas = coluna
    ? tarefas.filter((t) => t.coluna === coluna)
    : tarefas;

  const total = tarefasFiltradas.length;

  if (total === 0) {
    const mensagem = coluna
      ? `Nenhuma tarefa encontrada na coluna "${coluna} :/"`
      : "Você ainda não tem nenhuma tarefa, Que tal criar a primeira?";
    return res.json({ resumo: mensagem });
  }

  const concluidas = tarefasFiltradas.filter(
    (t) => t.coluna === "concluido",
  ).length;
  const andamento = tarefasFiltradas.filter(
    (t) => t.coluna === "andamento",
  ).length;
  const afazer = tarefasFiltradas.filter((t) => t.coluna === "afazer").length;

  const contagemPrioridade = {
    alta: tarefasFiltradas.filter((t) => t.prioridade === "alta").length,
    media: tarefasFiltradas.filter((t) => t.prioridade === "media").length,
    baixa: tarefasFiltradas.filter((t) => t.prioridade === "baixa").length,
  };
  const prioridadeComum = encontrarComum(contagemPrioridade);

  const resumo = `Você tem ${total} tarefa(s), ${concluidas} concluída(s), ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComum}.`;

  res.json({ resumo });
});
router.get("/estatisticas", (req, res) => {
  const { coluna } = req.query;

  const tarefasFiltradas = coluna
    ? tarefas.filter((t) => t.coluna === coluna)
    : tarefas;

  const totalTarefas = tarefasFiltradas.length;

  const porColuna = {
    afazer: tarefasFiltradas.filter((t) => t.coluna === "afazer").length,
    andamento: tarefasFiltradas.filter((t) => t.coluna === "andamento").length,
    concluido: tarefasFiltradas.filter((t) => t.coluna === "concluido").length,
  };

  const porPrioridade = {
    alta: tarefasFiltradas.filter((t) => t.prioridade === "alta").length,
    media: tarefasFiltradas.filter((t) => t.prioridade === "media").length,
    baixa: tarefasFiltradas.filter((t) => t.prioridade === "baixa").length,
  };

  res.json({
    filtroAplicado: coluna || "nenhum",
    total: totalTarefas,
    porColuna,
    porPrioridade,
    prioridadeComum: encontrarComum(porPrioridade),
  });
});

let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "concluido" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido" },
];
let proximoId = 4;

router.post("/", (req, res) => {
  const { texto, prioridade, coluna, cidade } = req.body;
  const novaTarefa = {
    id: proximoId++,
    texto: texto,
    prioridade: prioridade || "media",
    coluna: coluna || "afazer",
    cidade: cidade || " ",
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;

  const indice = tarefas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
  }
  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  res.json(tarefaAtualizada);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
  }
  tarefas = tarefas.filter((t) => t.id !== id);

  res.json({ mensagem: "Tarefa removida com sucesso!", id });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/" });
  }
  res.json(tarefa);
});

router.get("/", (req, res) => {
  const { coluna, prioridade } = req.query;
  let resultado = tarefas;
  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }
  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }

  res.json(resultado);
});

module.exports = router;
