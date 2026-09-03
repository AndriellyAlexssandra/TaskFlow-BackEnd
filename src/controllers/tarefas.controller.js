const tarefasModel = require("../models/tarefa.model");

const tarefasController = {
  estatisticas(req, res) {
    const { coluna } = req.query;
    const tarefasFiltradas = coluna
      ? tarefasModel.listarTarefasPorColuna(coluna)
      : tarefasModel.listarTarefas();

    const total = tarefasFiltradas.length;
    if (total === 0) {
      const mensagem = coluna
        ? `Nenhuma tarefa encontrada na coluna "${coluna} :/ "`
        : "Você ainda não tem nenhuma tarefa, Que tal criar a primeira? :) ";
      return res.json({ resumo: mensagem });
    }
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
    res.json({ total: tarefasFiltradas.length, porColuna, porPrioridade });
  },

  estatisticasResumo(req, res) {
    const total = tarefasModel.listarTarefas().length;

    const afazer = tarefasModel.listarTarefasPorColuna("afazer").length;
    const andamento = tarefasModel.listarTarefasPorColuna("andamento").length;
    const concluido = tarefasModel.listarTarefasPorColuna("concluido").length;

    const prioridades = {
      baixa: tarefasModel.listarTarefasPorPrioridade("baixa").length,
      media: tarefasModel.listarTarefasPorPrioridade("media").length,
      alta: tarefasModel.listarTarefasPorPrioridade("alta").length,
    };

    const prioridadeComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    const resumo = `Você tem ${total} tarefa(s): ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum é: ${prioridadeComum}`;

    res.json(resumo);
  },

  listarTarefas(req, res) {
    res.json(tarefasModel.listarTarefas());
  },

  buscarPorId(req, res) {
    const tarefa = tarefasModel.buscarPorId(req.params.id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada :/" });
    }
    res.json(tarefa);
  },

  criarTarefa(req, res) {
    const { texto, prioridade, coluna, cidade } = req.body;
    if (!texto || !prioridade || !coluna) {
      return res
        .status(400)
        .json({ erro: "Texto, prioridade e coluna são obrigatórios :/ " });
    }
    const novaTarefa = tarefasModel.criarTarefa(req.body);
    res.status(201).json(novaTarefa);
  },

  atualizarTarefa(req, res) {
    const tarefaAtualizada = tarefasModel.atualizarTarefa(
      parseInt(req.params.id),
      req.body,
    );
    if (!tarefaAtualizada) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada para a atualização:/ " });
    }
    res.json(tarefaAtualizada);
  },

  deletarTarefa(req, res) {
    const tarefaDeletada = tarefasModel.deletarTarefa(parseInt(req.params.id));
    if (!tarefaDeletada) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada para remover :/ " });
    }
    res.json({
      mensagem: "Tarefa removida com sucesso!",
      tarefa: tarefaDeletada,
    });
  },
};

module.exports = tarefasController;
