const usuariosModal = require("../models/usuario.model");
const tarefasModel = require("../models/tarefa.model");

const usuariosController = {
  async listarUsuarios(req, res) {
    res.json(await usuariosModal.listarUsuarios());
  },
  async buscarUsuarioPorId(req, res) {
    const { id } = req.params;
    const usuario = await usuariosModal.buscarUsuarioPorId(parseInt(id));
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuário não foi encontrado ou ele não existe :(" });
    }
    res.json(usuario);
  },
  async criarUsuario(req, res) {
    const { nome, email, senha_hash } = req.body;

    if (!nome || !email || !senha_hash) {
      return res
        .status(400)
        .json({ erro: "Nome, email e senha são obrigatorios" });
    }

    const emailExiste = await usuariosModal.listarUsuarios().then((usuarios) => {
      return usuarios.find((u) => u.email === email);
    });

    if (emailExiste) {
      return res.status(409).json({ erro: "Este email já existe!" });
    }
    const novoUsuario = await usuariosModal.criarUsuario(nome, email, senha_hash);
    return res.status(201).json(novoUsuario);
  },
  async atualizarUsuario(req, res) {
    const id = parseInt(req.params.id);
    const { nome, email, senha_hash } = req.body;

    if (email) {
      const emailExiste = await usuariosModal.listarUsuarios().then((usuarios) => {
        return usuarios.find((u) => u.email === email && u.id !== id);
      });
      if (emailExiste) {
        return res.status(400).json({ erro: "Este email já existe!" });
      }
    }
    const usuarioAtualizado = await usuariosModal.atualizarUsuario(
      id,
      nome,
      email,
      senha_hash,
    );
    if (!usuarioAtualizado) {
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado para a atualização :/ " });
    }


    res.json(usuarioAtualizado);
  },
  async deletarUsuario(req, res) {
    const id = Number(parseInt(req.params.id));
    const verificarUsuarioId = await tarefasModel.listarTarefas().then((tarefas) => {
      return tarefas.filter((t) => t.usuarioId === parseInt(id));
    });
    if (verificarUsuarioId.length > 0) {
      return res.status(400).json({
        erro: "Usuário possui tarefas. delete-as primeiro antes de deletar o usuário :/ ",
      });
    }
    const usuario = await usuariosModal.deletarUsuario(id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado :/" });
    }

    res.json({ mensagem: "Usuário removido com sucesso!", id });
  },
};
module.exports = usuariosController;
