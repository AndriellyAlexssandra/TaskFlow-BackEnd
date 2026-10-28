const pool = require("../database/db");
const prisma = require("../database/prisma");

module.exports = {
  listarProjetos: async () => {
    const result = await prisma.projetos.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        comentarios: true,
        usuarios: true,
        tarefas: true,
      },
      orderBy: { id: "asc" },
    });
    return result;
  },
  buscarProjetoPorId: async (id) => {
    const result = await prisma.projetos.findUnique({
      where: { id: id },
      select: {
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        comentarios: true,
        tarefas: true,
      },
    });
    return result;
  },
  criarProjeto: async (nome, descricao, usuario_id) => {
    const result = await prisma.projetos.create({
      data: {
        nome: nome,
        descricao: descricao || null,
        usuario_id: usuario_id,
      },
    });
    return result;
  },
  atualizarProjeto: async (id, nome, descricao, usuario_id) => {
    const projetoAtual = await prisma.projetos.findUnique({
      where: { id: id },
    });
    if (!projetoAtual) return null;

    const projetoAtualizado = await prisma.projetos.update({
      where: { id: id },
      data: {
        nome: nome,
        descricao: descricao,
        usuario_id: usuario_id,
      },
    });
    return projetoAtualizado;
  },
  deletarProjeto: async (id) => {
    try {
      const deletar = await prisma.tarefas.delete({
        where: { id },
      });
      return deletar;
    } catch (erro) {
      if (erro.code === "P2025") {
        return null;
      }
      throw erro;
    }
  },
};
