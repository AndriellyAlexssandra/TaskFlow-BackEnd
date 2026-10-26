const tarefasModel = require("../models/tarefa.model");

const usuariosModal = require("../models/usuario.model");

const criarErro = require("../utils/criarErro");

const tarefasController = {
  estatisticas(req, res) {
    const estatisticas = tarefasModel.estatisticas();
    res.json({estatisticas});
  },

    /*const { coluna } = req.query;
    const tarefasFiltradas = coluna
      ? tarefasModel.listarTarefasPorColuna(coluna)
      : tarefasModel.listarTarefas();*

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
  },*/
  estatisticasResumo(req, res) {
     const estatisticasResumo = tarefasModel.estatisticasResumo();

    res.json(estatisticasResumo);
  },

    /*const total = tarefasModel.listarTarefas().length;

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

    res.json(resumo);*/
    
  async listarTarefas(req, res) {
    const { usuario_id, coluna } = req.query;
    let resultado = coluna
      ? tarefasModel.listarPorUsuario(parseInt(coluna))
      : await tarefasModel.listarTarefas();

    /*if (coluna) {
      tarefas = tarefas.filter((t) => t.coluna === coluna);*/
    
    res.json(resultado);
  },

  async buscarTarefaPorId(req, res) {
    const tarefa = await tarefasModel.buscarTarefaPorId(parseInt(req.params.id));
    if (!tarefa) {
      throw criarErro(404, 'Tarefa não encontrada :/ ');
    } 
    res.json(tarefa);
  },

  async criarTarefa(req, res) {
    res.status(201).json(await tarefasModel.criarTarefa(req.body));

   /* if (coluna === "andamento" && usuarioId) {
      const tarefaAndamento = await tarefasModel
        .listarTarefasPorColuna("andamento")
        .filter((t) => t.usuarioId === parseInt(usuarioId)).length;
      if (tarefaAndamento >= 2) {
        throw criarErro(400, "Limite de 2 tarefas em andamento por usuário atingido");
      }
    }
    */
  },

  async atualizarTarefa(req, res) {
    const id = parseInt(req.params.id);
    const tarefaAtualizada = await tarefasModel.atualizarTarefa(id, req.body);
    
     if (!tarefaAtualizada)
      throw criarErro(404, "Tarefa não encontrada para atualizar");
    
    res.json(tarefaAtualizada);
    //const { coluna, prioridade_id, usuario_id } = req.body;
    /*const tarefaExiste = await tarefasModel.buscarTarefaPorId(id);

    if (!tarefaExiste) {
      throw criarErro(404, "Tarefa não encontrada para a atualização:/ ");
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
        throw criarErro(400, "Limite de 2 tarefas em andamento por usuário atingido");
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
*/
    
  },

  async deletarTarefa(req, res) {
    const tarefaDeletada = await tarefasModel.deletarTarefa(parseInt(req.params.id));
    if (!tarefaDeletada) {
      throw criarErro(404, "Tarefa não encontrada para remover :/ ");
    }
    res.json({mensagem: "Tarefa removida com sucesso!",tarefa: tarefaDeletada,});
  },
};

module.exports = tarefasController;