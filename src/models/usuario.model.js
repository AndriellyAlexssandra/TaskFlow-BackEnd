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

module.exports = {
  listarUsuarios: () => usuarios,
  buscarUsuarioPorId: (id) => usuarios.find((u) => u.id === id),
  criarUsuario: (nome, email, senha) => {
    const novoUsuario = { id: proximoIdUsuario, nome, email, senha };
    usuarios.push(novoUsuario);
    proximoIdUsuario++;
    return novoUsuario;
  },
  atualizarUsuario: (id, nome, email, senha) => {
    const indice = usuarios.findIndex((u) => u.id === id);
    if (indice === -1) return null;
    usuarios[indice] = { id, nome, email, senha };
    return usuarios[indice];
  },
  deletarUsuario: (id) => {
    const indice = usuarios.findIndex((u) => u.id === id);
    if (indice === -1) return null;
    return usuarios.splice(indice, 1)[0];
  },
};
