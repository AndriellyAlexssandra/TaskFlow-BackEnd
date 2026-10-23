const pool = require("../database/db");

module.exports = {
  listarTarefas: async () => {
    const result =
      await pool.query(`SELECT t.*, p.nome as projeto, u.nome as usuario FROM tarefas t
        inner join projetos p on t.projeto_id = p.id 
        inner join prioridades pr on t.prioridade_id = pr.id
        inner join usuarios u on t.usuario_id = u.id ORDER BY t.id`);
        
        /*const result = await pool.query('SELECT * FROM tarefas ORDER BY id');
*/
        return result.rows;
  },
  listarTarefasPorColuna: async (coluna) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE coluna = $1", [
      coluna,
    ]);
    return result.rows;
  },
  listarTarefasPorPrioridade: async (prioridade) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE prioridade = $1",
      [prioridade],
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
  buscarUsuarioPorId: async (usuarioId) => {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      usuarioId,
    ]);
    return result.rows[0] || null;
  },

  buscarTarefaPorId: async (id) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },
  criarTarefa: async ({
    texto,
    prioridade_id,
    coluna,
    usuario_id,
    projeto_id,
  }) => {
    const result = await pool.query(
      "INSERT INTO tarefas (texto, prioridade_id, coluna, usuario_id, projeto_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [texto, prioridade_id || 2, coluna || "afazer", usuario_id, projeto_id],
    );
    return result.rows[0];
  },

  atualizarTarefa: async (id, dadosAtualizados) => {
    const tarefaAtual = await pool.query(
      "SELECT * FROM tarefas WHERE id = $1",
      [id],
    );
    const finalizadaEm =
      dadosAtualizados.coluna === "concluido" ? new Date() : null;

    let iniciadaEm = tarefaAtual.rows[0].iniciado_em;

    if (
      tarefaAtual.rows[0].coluna === "em andamento" &&
      dadosAtualizados.coluna === "afazer"
    ) {
      iniciadaEm = null;
    } else if (
      tarefaAtual.rows[0].coluna === "afazer" &&
      dadosAtualizados.coluna === "em andamento"
    ) {
      iniciadaEm = new Date();
    }

    const result = await pool.query(
      `UPDATE tarefas SET 
                texto=$1,
                coluna=$2,
                usuario_id=$3,
                projeto_id=$4,
                prioridade_id=$5,
                finalizado_em=$6,
                iniciado_em=$7
            WHERE id=$8 
            RETURNING *`,
      [
        dadosAtualizados.texto,
        dadosAtualizados.coluna,
        dadosAtualizados.usuario_id,
        dadosAtualizados.projeto_id,
        dadosAtualizados.prioridade_id,
        finalizadaEm,
        iniciadaEm,
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