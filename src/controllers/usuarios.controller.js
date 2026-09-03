let usuarios = [
  { id: 1, nome: "francisca", email: "francisca@gmail.com", senha: "francis1" },
  {
    id: 2,
    nome: "minguado",
    email: "minguado@outlook.com",
    senha: "minguado6",
  },
  { id: 3, nome: "cleidiana", email: "cleidiana@opera.com", senha: "bolinho0" },
];
let proximoIdUsuario = 4;
const usuariosController = {
  listarUsuarios(req, res) {
    res.json(usuarios);
  },
  buscarPorId(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarios.find((u) => u.id === id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
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
    const emailExiste = usuarios.find((u) => u.email === email);
    if (emailExiste) {
      return res.status(400).json({ erro: "Este email já existe!" });
    }
    const novoUsuario = {
      id: proximoIdUsuario,
      nome: nome,
      email: email,
      senha: senha,
    };
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
  },
  atualizarUsuario(req, res) {
    const id = Number(req.params.id);
    const { nome, email, senha } = req.body;

    const emailExiste = usuarios.find(
      (u) => u.email === req.body.email && u.id !== id,
    );
    if (emailExiste) {
      return res.status(400).json({ erro: "Este email já existe!" });
    }
    const indice = usuarios.findIndex((u) => u.id === id);
    if (indice === -1) {
      return res.status(404).json({ erro: "Usuário não encontrado :/" });
    }
    const usuarioAtualizado = { id, nome, email, senha };
    usuarios[indice] = usuarioAtualizado;

    res.json(usuarioAtualizado);
  },
  deletarUsuario(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado :/" });
    }
    usuarios = usuarios.filter((u) => u.id !== id);
    res.json({ mensagem: "Usuário removido com sucesso!", id });
  }, 
};
module.exports = usuariosController;
