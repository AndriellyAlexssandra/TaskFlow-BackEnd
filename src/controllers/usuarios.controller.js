const usuariosModal = require("../models/usuario.model");
const tarefasModel = require("../models/tarefa.model");
const criarErro = require("../utils/criarErro");

const usuariosController = {
  async listarUsuarios(req, res) {
    res.json(await usuariosModal.listarUsuarios());
  },
  async buscarUsuarioPorId(req, res) {
    const { id } = req.params;
    const usuario = await usuariosModal.buscarUsuarioPorId(parseInt(id));
    if (!usuario) {
      throw criarErro(404, "Usuário não encontrado :(");
    }
    res.json(usuario);
  },
  async criarUsuario(req, res) {
    const { nome, email, senha_hash } = req.body;

    if (!nome || !email || !senha_hash) {
      throw criarErro(400, "Nome, email e senha são obrigatorios :/");
    }

    const emailExiste = await usuariosModal.listarUsuarios().then((usuarios) => {
      return usuarios.find((u) => u.email === email);
    });

    if (emailExiste) {
      throw criarErro(409, "Este email já existe!");
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
        throw criarErro(400, "Este email já existe!");
      }
    }
    const usuarioAtualizado = await usuariosModal.atualizarUsuario(
      id,
      nome,
      email,
      senha_hash,
    );
    if (!usuarioAtualizado) {
    throw criarErro(404, "Usuário não encontrado para atualização :/ ");
    }

    res.json(usuarioAtualizado);
  },
  async deletarUsuario(req, res) {
    const id = Number(parseInt(req.params.id));
    const verificarUsuarioId = await tarefasModel.listarTarefas().then((tarefas) => {
      return tarefas.filter((t) => t.usuarioId === parseInt(id));
    });
    if (verificarUsuarioId.length > 0) {
      throw criarErro(400, "Usuário possui tarefas. delete-as primeiro antes de deletar o usuário :/ ");
    }
    const usuario = await usuariosModal.deletarUsuario(id);

    if (!usuario) {
      throw criarErro(404, "Usuário não encontrado :/");
    }

    res.json({ mensagem: "Usuário removido com sucesso!", id });
  },
};
module.exports = usuariosController;
