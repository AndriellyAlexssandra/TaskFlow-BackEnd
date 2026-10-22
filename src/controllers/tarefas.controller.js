const tarefasModel = require("../models/tarefa.model");
const criarErro = require("../utils/criarErro");

const LIMITE_ANDAMENTO_POR_USUARIO = 2;

const NOME_PRIORIDADE = { 1: "baixa", 2: "media", 3: "alta" };

async function contarEmAndamento(usuarioId, ignorarId = null) {
  const emAndamento = await tarefasModel.listarTarefasPorColuna("andamento");
  return emAndamento.filter(
    (t) => t.usuario_id === usuarioId && t.id !== ignorarId,
  ).length;
}

const tarefasController = {
  async estatisticas(req, res) {
    const { coluna } = req.query;
    const todas = await tarefasModel.listarTarefas();
    const tarefas = coluna ? todas.filter((t) => t.coluna === coluna) : todas;

    if (tarefas.length === 0) {
      const mensagem = coluna
        ? `Nenhuma tarefa encontrada na coluna "${coluna}" :/`
        : "Você ainda não tem nenhuma tarefa. Que tal criar a primeira? :)";
      return res.json({ resumo: mensagem });
    }

    const porColuna = {
      afazer: tarefas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefas.filter((t) => t.coluna === "andamento").length,
      concluido: tarefas.filter((t) => t.coluna === "concluido").length,
    };

    const porPrioridade = { alta: 0, media: 0, baixa: 0 };
    for (const t of tarefas) {
      const nome = NOME_PRIORIDADE[t.prioridade_id];
      if (nome) porPrioridade[nome]++;
    }

    const contagemPorUsuario = {};
    for (const t of tarefas) {
      if (!contagemPorUsuario[t.usuario_id]) {
        contagemPorUsuario[t.usuario_id] = { nome: t.usuario, total: 0 };
      }
      contagemPorUsuario[t.usuario_id].total++;
    }

    const rankingUsuarios = Object.entries(contagemPorUsuario)
      .map(([usuarioId, dados]) => ({
        usuarioId: Number(usuarioId),
        nome: dados.nome || "Desconhecido",
        totalTarefas: dados.total,
      }))
      .sort((a, b) => b.totalTarefas - a.totalTarefas);

    res.json({
      total: tarefas.length,
      porColuna,
      porPrioridade,
      rankingUsuarios,
    });
  },

  async estatisticasResumo(req, res) {
    const todas = await tarefasModel.listarTarefas();

    const total = todas.length;
    const afazer = todas.filter((t) => t.coluna === "afazer").length;
    const andamento = todas.filter((t) => t.coluna === "andamento").length;
    const concluido = todas.filter((t) => t.coluna === "concluido").length;

    const prioridades = { baixa: 0, media: 0, alta: 0 };
    for (const t of todas) {
      const nome = NOME_PRIORIDADE[t.prioridade_id];
      if (nome) prioridades[nome]++;
    }

    const prioridadeComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    res.json(
      `Você tem ${total} tarefa(s): ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum é: ${prioridadeComum}`,
    );
  },

  async listarTarefas(req, res) {
    const { usuarioId, coluna } = req.query;
    let tarefas = await tarefasModel.listarTarefas();

    if (usuarioId) {
      tarefas = tarefas.filter((t) => t.usuario_id === parseInt(usuarioId));
    }
    if (coluna) {
      tarefas = tarefas.filter((t) => t.coluna === coluna);
    }
    res.json(tarefas);
  },

  async buscarTarefaPorId(req, res) {
    const tarefa = await tarefasModel.buscarTarefaPorId(parseInt(req.params.id));
    if (!tarefa) {
      throw criarErro(404, "Tarefa não encontrada :/");
    }
    res.json(tarefa);
  },

  async criarTarefa(req, res) {
    const { coluna, usuario_id } = req.body;

    if (coluna === "andamento" && usuario_id) {
      const total = await contarEmAndamento(Number(usuario_id));
      if (total >= LIMITE_ANDAMENTO_POR_USUARIO) {
        throw criarErro(
          400,
          "Limite de 2 tarefas em andamento por usuário atingido",
        );
      }
    }

    const novaTarefa = await tarefasModel.criarTarefa(req.body);
    res.status(201).json(novaTarefa);
  },

  async atualizarTarefa(req, res) {
    const id = parseInt(req.params.id);
    const tarefaExiste = await tarefasModel.buscarTarefaPorId(id);

    if (!tarefaExiste) {
      throw criarErro(404, "Tarefa não encontrada para a atualização :/");
    }

    const novaColuna = req.body.coluna ?? tarefaExiste.coluna;
    const usuarioId = Number(req.body.usuario_id ?? tarefaExiste.usuario_id);

    const entrandoEmAndamento =
      novaColuna === "andamento" && tarefaExiste.coluna !== "andamento";
    const trocouUsuario = usuarioId !== tarefaExiste.usuario_id;

    if (novaColuna === "andamento" && (entrandoEmAndamento || trocouUsuario)) {
      const total = await contarEmAndamento(usuarioId, id);
      if (total >= LIMITE_ANDAMENTO_POR_USUARIO) {
        throw criarErro(
          400,
          "Limite de 2 tarefas em andamento por usuário atingido",
        );
      }
    }

    const tarefaAtualizada = await tarefasModel.atualizarTarefa(id, req.body);
    res.json(tarefaAtualizada);
  },

  async deletarTarefa(req, res) {
    const tarefaDeletada = await tarefasModel.deletarTarefa(
      parseInt(req.params.id),
    );
    if (!tarefaDeletada) {
      throw criarErro(404, "Tarefa não encontrada para remover :/");
    }
    res.json({
      mensagem: "Tarefa removida com sucesso!",
      tarefa: tarefaDeletada,
    });
  },
};

module.exports = tarefasController;