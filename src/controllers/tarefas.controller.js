let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido" },
];
let proximoId = 4;

const tarefasController = {
  estatisticas(req, res) {
    const { coluna } = req.query;
    const tarefasFiltradas = coluna
      ? tarefas.filter((t) => t.coluna === coluna)
      : tarefas;

    if (total === 0) {
      const mensagem = coluna
        ? `Nenhuma tarefa encontrada na coluna "${coluna} :/"`
        : "Você ainda não tem nenhuma tarefa, Que tal criar a primeira? :) ";
      return res.json({ resumo: mensagem });
    }
    const total = tarefasFiltradas.length;

    const porColuna = {
      afazer: tarefasFiltradas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefasFiltradas.filter((t) => t.coluna === "andamento")
        .length,
      concluido: tarefasFiltradas.filter((t) => t.coluna === "concluido")
        .length,
    };

    const porPrioridade = {
      alta: tarefasFiltradas.filter((t) => t.prioridade === "alta").length,
      media: tarefasFiltradas.filter((t) => t.prioridade === "media").length,
      baixa: tarefasFiltradas.filter((t) => t.prioridade === "baixa").length,
    };

    res.json({ coluna: coluna || "todas", total, porColuna, porPrioridade });
  },

  estatisticasResumo(req, res) {
    const total = tarefas.length;

    const afazer = tarefas.filter((t) => t.coluna === "afazer").length;
    const andamento = tarefas.filter((t) => t.coluna === "andamento").length;
    const concluido = tarefas.filter((t) => t.coluna === "concluido").length;

    const prioridades = {
      baixa: tarefas.filter((t) => t.prioridade === "baixa").length,
      media: tarefas.filter((t) => t.prioridade === "media").length,
      alta: tarefas.filter((t) => t.prioridade === "alta").length,
    };

    const prioridadeComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    const resumo = `Você tem ${total} tarefa(s): ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum é: ${prioridadeComum}`;

    res.json(resumo);
  },

  listarTarefas(req, res) {
    const { coluna, prioridade } = req.query;
    let resultado = tarefas;
    if (coluna) {
      resultado = resultado.filter((t) => t.coluna === coluna);
    }
    if (prioridade) {
      resultado = resultado.filter((t) => t.prioridade === prioridade);
    }
    res.json(resultado);
  },
  buscarPorId(req, res) {
    const id = Number(req.params.id);
    const tarefa = tarefas.find((t) => t.id === id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada :/" });
    }
    res.json(tarefa);
  },

  criarTarefa(req, res) {
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
  },
  atualizarTarefa(req, res) {
    const id = Number(req.params.id);
    const { texto, prioridade, coluna, cidade } = req.body;

    const indice = tarefas.findIndex((t) => t.id === id);
    if (indice === -1) {
      return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
    }
    const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
    tarefas[indice] = tarefaAtualizada;

    res.json(tarefaAtualizada);
  },
  deletarTarefa(req, res) {
    const id = Number(req.params.id);
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
    }
    tarefas = tarefas.filter((t) => t.id !== id);

    res.json({ mensagem: "Tarefa removida com sucesso!", id });
  },
};

module.exports = tarefasController;
