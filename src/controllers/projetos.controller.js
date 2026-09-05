const projetosModel = require("../models/projetos.model");
const tarefasModel = require("../models/tarefa.model");

const projetosController = {
  listarProjetos(req, res) {
    res.json(projetosModel.listarProjetos());
  },
  postarProjetos(req, res) {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
      return res
        .status(400)
        .json({ message: "Nome e descrição são obrigatórios!" });
    }
    const novoProjeto = projetosModel.criarProjeto(nome, descricao);
    res.status(201).json(novoProjeto);
  },
  buscarProjetoPorId(req, res) {
    const { id } = req.params;
    const projeto = projetosModel.buscarProjetoPorId(parseInt(id));
    if (!projeto) {
      return res
        .status(404)
        .json({ message: "Projeto não foi encontrado ou ele não existe :(" });
    }
    res.json(projeto);
  },
  atualizarProjetos(req, res) {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const projetoAtualizado = projetosModel.atualizarProjeto(
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
  deletarProjetos(req, res) {
    const { id } = req.params;
    const projetoId = parseInt(id);
    const tarefasDoProjeto = tarefasModel
      .listarTarefas()
      .filter((t) => t.projetoId === projetoId);
    if (tarefasDoProjeto.length > 0) {
      return res
        .status(400)
        .json({ erro: "Projeto possui tarefas associadas!" });
    }

    const projetoDeletado = projetosModel.deletarProjeto(projetoId);
    if (!projetoDeletado) {
      return res.status(404).json({
        message: "Esse Projeto não foi encontrado ou ele não existe :(",
      });
    }
    res.json({ message: "Projeto removido com sucesso!" });
  },
  resumoProjeto(req, res) {
    const { id } = req.params;
    const projetoId = parseInt(id);
    const projeto = projetosModel.buscarProjetoPorId(projetoId);
    if (!projeto) {
      return res
        .status(404)
        .json({ message: "Projeto não foi encontrado ou ele não existe :(" });
    }
    const tarefasDoProjeto = tarefasModel.listarTarefas().filter(
      (t) => t.projetoId === projetoId,
    );
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
