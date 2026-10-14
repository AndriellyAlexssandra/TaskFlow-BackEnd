const tarefasModel = require("../models/tarefa.model");

const usuariosModal = require("../models/usuario.model");

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
    const todasTarefas = tarefasModel.listarTarefas();
    const contagemPorUsuario = todasTarefas.reduce((acumulador, tarefa) => {
      const id = tarefa.usuarioId;
      acumulador[id] = (acumulador[id] || 0) + 1;
      return acumulador;
    }, {});

    const rankingUsuarios = Object.entries(contagemPorUsuario)
      .map(([usuarioId, totalTarefas]) => {
        const usuario = usuariosModal.buscarUsuarioPorId(parseInt(usuarioId));
        return {
          usuarioId: parseInt(usuarioId),
          nome: usuario ? usuario.nome : "Desconhecido",
          totalTarefas,
        };
      })
      .sort((a, b) => b.totalTarefas - a.totalTarefas);

    res.json({ total: tarefasFiltradas.length, porColuna, porPrioridade, rankingUsuarios });
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

  async listarTarefas(req, res) {
    const { usuarioId, coluna } = req.query;
    let tarefas = usuarioId
      ? tarefasModel.listarPorUsuario(parseInt(usuarioId))
      : await tarefasModel.listarTarefas();

    if (coluna) {
      tarefas = tarefas.filter((t) => t.coluna === coluna);
    }
    res.json(tarefas);
  },

  async buscarTarefaPorId(req, res) {
    const { id } = req.params;
    const tarefa = await tarefasModel.buscarTarefaPorId(parseInt(id));
    if (!tarefa) {
      return res
        .status(404)
        .json({ message: "Tarefa não foi encontrada ou ela não existe :(" });
    }
    res.json(tarefa);
  },

  async criarTarefa(req, res) {
    const { coluna, usuarioId } = req.body;

    if (coluna === "andamento" && usuarioId) {
      const tarefaAndamento = tarefasModel
        .listarTarefasPorColuna("andamento")
        .filter((t) => t.usuarioId === parseInt(usuarioId)).length;
      if (tarefaAndamento >= 2) {
        return res.status(400).json({
          erro: "Limite de 2 tarefas em andamento por usuário atingido",
        });
      }
    }
    
    const novaTarefa = await tarefasModel.criarTarefa(req.body);
    res.status(201).json(novaTarefa);
  },

  async atualizarTarefa(req, res) {
    const { coluna, prioridade_id, usuario_id } = req.body;
    const id = parseInt(req.params.id);
    const tarefaExiste = await tarefasModel.buscarTarefaPorId(id);

    if (!tarefaExiste) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada para a atualização:/ " });
    }

    const novaColuna = req.body.coluna ?? tarefaExiste.coluna;
    const usuarioId = req.body.usuario_id ?? tarefaExiste.usuario_id;

    if (novaColuna === "andamento" && usuario_id) {
      const tarefaAndamento = tarefasModel
        .listarTarefasPorColuna("andamento")
        .filter(
          (t) => t.usuarioId === parseInt(usuario_id) && t.id !== id,
        ).length;
      if (tarefaAndamento >= 2) {
        return res.status(400).json({
          erro: "Limite de 2 tarefas em andamento por usuário atingido",
        });
      }
    }
    const dadosAtualizar = { ...req.body };
    delete dadosAtualizar.concluidaEm;

    const estavaConcluida = tarefaExiste.coluna === "concluido";
    const estaConcluindo = novaColuna === "concluido";

    if (!estavaConcluida && estaConcluindo) {
      dadosAtualizar.concluidaEm = new Date().toISOString();
    } else if (estavaConcluida && !estaConcluindo) {
      dadosAtualizar.concluidaEm = null;
    }

    const tarefaAtualizada = await tarefasModel.atualizarTarefa(id, dadosAtualizar);
    res.json(tarefaAtualizada);
  },

  async deletarTarefa(req, res) {
    const { id } = req.params;
  
    const tarefaDeletada = await tarefasModel.deletarTarefa(parseInt(id));
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
