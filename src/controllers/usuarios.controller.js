const usuariosModal = require("../models/usuario.model");

const usuariosController = {
  listarUsuarios(req, res) {
    res.json(usuariosModal.listarUsuarios());
  },
  buscarUsuarioPorId(req, res) {
    const { id } = req.params;
    const usuario = usuariosModal.buscarUsuarioPorId(parseInt(id));
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuário não foi encontrado ou ele não existe :(" });
    }
    res.json(usuario);
  },
  criarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "Nome, email e senha são obrigatorios" });
    }

    const emailExiste = usuariosModal
      .listarUsuarios()
      .find((u) => u.email === email);

    if (emailExiste) {
      return res.status(400).json({ erro: "Este email já existe!" });
    }
    const novoUsuario = usuariosModal.criarUsuario(nome, email, senha);
    return res.status(201).json(novoUsuario);
  },
  atualizarUsuario(req, res) {
    const usuarioAtualizado = usuariosModal.atualizarUsuario(
      parseInt(req.params.id),
      req.body,
    );
    if (!usuarioAtualizado) {
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado para a atualização :/ " });
    }
    const emailExiste = usuariosModal
      .listarUsuarios()
      .find((u) => u.email === req.body.email);
    if (emailExiste) {
      return res.status(400).json({ erro: "Este email já existe!" });
    }

    res.json(usuarioAtualizado);
  },
  deletarUsuario(req, res) {
    const id = Number(parseInt(req.params.id));
    const usuario = usuariosModal.deletarUsuario(id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado :/" });
    }

    res.json({ mensagem: "Usuário removido com sucesso!", id });
  },
};
module.exports = usuariosController;
