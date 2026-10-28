const pool = require("../database/db");
const prisma = require("../database/prisma");

let usuarios = [
  {
    id: 1,
    nome: "francisca",
    email: "francisca@gmail.com",
    senha_hash: "francis1",
  },
  {
    id: 2,
    nome: "minguado",
    email: "minguado@outlook.com",
    senha_hash: "minguado6",
  },
  {
    id: 3,
    nome: "cleidiana",
    email: "cleidiana@opera.com",
    senha_hash: "bolinho0",
  },
  {
    id: 4,
    nome: "Alice",
    email: "alice@email.com",
    senha_hash: "123456",
  },
  {
    id: 5,
    nome: "Admin",
    email: "admin@email.com",
    senha_hash: "1234",
  },
];
let proximoIdUsuario = 4;

module.exports = {
  listarUsuarios: async () => {
    const result = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: { id: "asc" },
    });
    return result;
  },

  buscarUsuarioPorId: async (id) => {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: id },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
    return usuario ? usuario : null;
  },
  buscarPorEmail: async (email) => {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  },
  criarUsuario: async (nome, email, senha_hash) => {
    const usuario = await prisma.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senha_hash: senha_hash,
      },
    });
    return usuario;
  },
  atualizarUsuario: async (id, dadosAtualizados) => {
    const usuarioAtual = await prisma.usuarios.findUnique({
      where: { id: id },
    });
    if (!usuarioAtual) return null;

    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id: id },
      data: {
        nome: dadosAtualizados.nome,
        email: dadosAtualizados.email,
        senha_hash: dadosAtualizados.senha_hash,
      },
    });
    return usuarioAtualizado;
  },
  deletarUsuario: async (id) => {
    try {
      const usuario = await prisma.usuarios.delete({
        where: { id },
      });
      return usuario;
    } catch (erro) {
      if (erro.code === "P2025") {
        return null;
      }
      throw erro;
    }
  },
};
