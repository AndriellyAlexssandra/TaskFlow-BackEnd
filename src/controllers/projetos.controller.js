const projetosModel = require("../models/projetos.model");
const tarefasModel = require("../models/tarefa.model");

const projetosController = {
  async listarProjetos(req, res) {
    res.json(await projetosModel.listarProjetos());
  },
  async postarProjetos(req, res) {
    const { nome, descricao } = req.body;
    if (!nome) {
      return res
        .status(400)
        .json({ message: "Nome é obrigatório!" });
    }
    const novoProjeto = await projetosModel.criarProjeto(nome, descricao, req.usuario.id);
    res.status(201).json(novoProjeto);
  },
  async buscarProjetoPorId(req, res) {
    const { id } = req.params;
    const projeto = await projetosModel.buscarProjetoPorId(parseInt(id));
    if (!projeto) {
      return res
        .status(404)
        .json({ message: "Projeto não foi encontrado ou ele não existe :(" });
    }
    res.json(projeto);
  },
  async atualizarProjetos(req, res) {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const projetoAtualizado = await projetosModel.atualizarProjeto(
      parseInt(id),
      nome,
      descricao,
    );
    if (!projetoAtualizado) {
      return res.status(404).json({
        message: "Esse Projeto não foi encontrado ou ele não existe :(",
      });
    }
    res.json(projetoAtualizado);
  },
  async deletarProjetos(req, res) {
    const { id } = req.params;
    const projetoId = parseInt(id);
    const tarefasDoProjeto = await tarefasModel.listarTarefas().then((tarefas) => {
      return tarefas.filter((t) => t.projeto_id === projetoId);
    });
    if (tarefasDoProjeto.length > 0) {
      return res
        .status(400)
        .json({ erro: "Projeto possui tarefas associadas!" });
    }

    const projetoDeletado = await projetosModel.deletarProjeto(projetoId);
    if (!projetoDeletado) {
      return res.status(404).json({
        message: "Esse Projeto não foi encontrado ou ele não existe :(",
      });
    }
    res.json({ message: "Projeto removido com sucesso!" });
  },
  async resumoProjeto(req, res) {
    const { id } = req.params;
    const projetoId = parseInt(id);
    const projeto = await projetosModel.buscarProjetoPorId(projetoId);
    if (!projeto) {
      return res
        .status(404)
        .json({ message: "Projeto não foi encontrado ou ele não existe :(" });
    }
    const tarefasDoProjeto = await tarefasModel.listarTarefas().then((tarefas) => {
      return tarefas.filter((t) => t.projeto_id === projetoId);
    });
    const porColuna = {
      afazer: tarefasDoProjeto.filter((t) => t.coluna === "afazer").length,
      andamento: tarefasDoProjeto.filter((t) => t.coluna === "andamento")
        .length,
      concluido: tarefasDoProjeto.filter((t) => t.coluna === "concluido")
        .length,
    };
    res.json({ projeto, totalTarefas: tarefasDoProjeto.length, porColuna});
  },
};
module.exports = projetosController;
