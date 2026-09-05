const tarefaModel = require("../models/tarefa.model");
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
    const { usuarioId, coluna } = req.query;
    let tarefas = usuarioId
      ? tarefasModel.listarPorUsuario(parseInt(usuarioId))
      : tarefasModel.listarTarefas();

    if (coluna) {
      tarefas = tarefas.filter((t) => t.coluna === coluna);
    }
    res.json(tarefas);
  },

  buscarTarefaPorId(req, res) {
    const { id } = req.params;
    const tarefa = tarefasModel.buscarTarefaPorId(parseInt(id));
    if (!tarefa) {
      return res
        .status(404)
        .json({ message: "Tarefa não foi encontrada ou ela não existe :(" });
    }
    res.json(tarefa);
  },

  criarTarefa(req, res) {
    const { texto, prioridade, coluna, usuarioId } = req.body;
    if (!texto || !prioridade || !coluna) {
      return res
        .status(400)
        .json({ erro: "Texto, prioridade e coluna são obrigatórios :/ " });
    }
    const prioridadesValidas = ["baixa", "media", "alta"];
    if (!prioridadesValidas.includes(prioridade)) {
      return res.status(400).json({
        erro: "Prioridade inválida. Escolha entre 'baixa', 'media' ou 'alta'. :/ ",
      });
    }
    const colunasValidas = ["afazer", "andamento", "concluido"];
    if (!colunasValidas.includes(coluna)) {
      return res.status(400).json({
        erro: "Coluna inválida. Escolha entre 'afazer', 'andamento' ou 'concluido'. :/ ",
      });
    }
    const usuariosId = usuariosModal.buscarUsuarioPorId(usuarioId);
    if (!usuariosId) {
      return res
        .status(400)
        .json({ erro: "Id usuário inválido ou Usuário não encontrado :/ " });
    }
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
    const novaTarefa = tarefasModel.criarTarefa(req.body);
    res.status(201).json(novaTarefa);
  },

  atualizarTarefa(req, res) {
    const id = parseInt(req.params.id);
    const tarefaExiste = tarefasModel.buscarTarefaPorId(id);

    if (!tarefaExiste) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada para a atualização:/ " });
    }
    const novaColuna = req.body.coluna ?? tarefaExiste.coluna;
    const usuarioId = req.body.usuarioId ?? tarefaExiste.usuarioId;

    if (novaColuna === "andamento" && usuarioId) {
      const tarefaAndamento = tarefasModel
        .listarTarefasPorColuna("andamento")
        .filter(
          (t) => t.usuarioId === parseInt(usuarioId) && t.id !== id,
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

    const tarefaAtualizada = tarefasModel.atualizarTarefa(id, dadosAtualizar);
    res.json(tarefaAtualizada);
  },

  deletarTarefa(req, res) {
    const { id } = req.params;
    const verificarUsuarioId = tarefasModel
      .listarTarefas()
      .filter((t) => t.usuarioId === parseInt(id));
    if (verificarUsuarioId.length > 0) {
      return res.status(400).json({
        erro: "Usuário possui tarefas. delete-as primeiro antes de deletar o usuário :/ ",
      });
    }

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
