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
        tarefas: true
      },
    });
    return result;
  },
  criarProjeto: async (nome, descricao, usuario_id) => {
    const result = await pool.query(
      "INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *",
      [nome, descricao, usuario_id],
    );
    return result.rows[0];
  },
  atualizarProjeto: async (id, nome, descricao) => {
    const result = await pool.query(
      "UPDATE projetos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
      [nome, descricao, id],
    );
    return result.rows[0] || null;
  },
  deletarProjeto: async (id) => {
    const result = await pool.query(
      "DELETE FROM projetos WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
