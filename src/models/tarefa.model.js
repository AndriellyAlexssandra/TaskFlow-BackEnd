const pool = require("../database/db");

module.exports = {
  listarTarefas: async () => {
    const result = await pool.query(`
      SELECT t.*, p.nome AS projeto, u.nome AS usuario
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN usuarios u ON t.usuario_id = u.id
      ORDER BY t.id
    `);
    return result.rows;
  },

  listarTarefasPorColuna: async (coluna) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE coluna = $1",
      [coluna],
    );
    return result.rows;
  },

  listarTarefasPorPrioridade: async (prioridadeId) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE prioridade_id = $1",
      [prioridadeId],
    );
    return result.rows;
  },

  listarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1",
      [usuarioId],
    );
    return result.rows;
  },

  buscarTarefaPorId: async (id) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  criarTarefa: async ({ texto, prioridade_id, coluna, usuario_id, projeto_id }) => {
    const result = await pool.query(
      `INSERT INTO tarefas (texto, prioridade_id, coluna, usuario_id, projeto_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [texto, prioridade_id || 2, coluna || "afazer", usuario_id, projeto_id],
    );
    return result.rows[0];
  },

  atualizarTarefa: async (id, dados) => {
    const atual = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
    const tarefa = atual.rows[0];
    if (!tarefa) return null;

    const novaColuna = dados.coluna ?? tarefa.coluna;
    let iniciadaEm = tarefa.iniciado_em;
    let finalizadaEm = tarefa.finalizado_em;

    if (novaColuna !== tarefa.coluna) {
      iniciadaEm = novaColuna === "andamento" ? new Date() : null;
      finalizadaEm = novaColuna === "concluido" ? new Date() : null;
    }

    const result = await pool.query(
      `UPDATE tarefas SET
         texto = $1,
         coluna = $2,
         usuario_id = $3,
         projeto_id = $4,
         prioridade_id = $5,
         iniciado_em = $6,
         finalizado_em = $7
       WHERE id = $8
       RETURNING *`,
      [
        dados.texto ?? tarefa.texto,
        novaColuna,
        dados.usuario_id ?? tarefa.usuario_id,
        dados.projeto_id !== undefined ? dados.projeto_id : tarefa.projeto_id,
        dados.prioridade_id ?? tarefa.prioridade_id,
        iniciadaEm,
        finalizadaEm,
        id,
      ],
    );
    return result.rows[0] || null;
  },

  deletarTarefa: async (id) => {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};