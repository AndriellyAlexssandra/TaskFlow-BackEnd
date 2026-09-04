const projetosModel = require("../models/projetos.model");

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
    const projetoAtualizado = projetosModel.atualizarProjeto(parseInt(id), nome, descricao);
    if (!projetoAtualizado) {
      return res
        .status(404)
        .json({
          message: "Esse Projeto não foi encontrado ou ele não existe :(",
        });
    }
    res.json(projetoAtualizado);
  },
  deletarProjetos(req, res) {
    const { id } = req.params;
    const projetoDeletado = projetosModel.deletarProjeto(parseInt(id));
    if (!projetoDeletado) {
      return res
        .status(404)
        .json({
          message: "Esse Projeto não foi encontrado ou ele não existe :(",
        });
    }
    res.json({ message: "Projeto removido com sucesso!" });
  },
};
module.exports = projetosController;
