const pool =  require('../database/db');
/*let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "afazer", usuarioId: 1, projetoId:1},
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento", usuarioId: 2, projetoId: 2},
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido", usuarioId: 3, projetoId: 3},
];
let proximoId = 4;*/

module.exports = { 
    listarTarefas: async () => {
        const result = await pool.query('SELECT * FROM tarefas ORDER BY id');
        return result.rows;
    },
    listarTarefasPorColuna: async (coluna) => {
        const result = await pool.query('SELECT * FROM tarefas WHERE coluna = $1', [coluna]);
        return result.rows;
    },
    listarTarefasPorPrioridade: async (prioridade) => {
        const result = await pool.query('SELECT * FROM tarefas WHERE prioridade = $1', [prioridade]);
        return result.rows;
    },

    listarPorUsuario: async (usuarioId) => {
        const result = await pool.query('SELECT * FROM tarefas WHERE usuarioId = $1', [usuarioId]);
        return result.rows;
    },
    buscarUsuarioPorId: async (usuarioId) => {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId]);
        return result.rows[0] || null;
    },

    buscarTarefaPorId: async (id) => {
        const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    criarTarefa: async ({ texto, prioridade_id, coluna, usuario_id, projeto_id }) => {
        const result = await pool.query(
        'INSERT INTO tarefas (texto, prioridade_id, coluna, usuario_id, projeto_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [texto, prioridade_id || 2, coluna || 'afazer', usuario_id, projeto_id]
        );
        return result.rows[0];
    },

    atualizarTarefa: async (id, dadosAtualizados) => {
        const { texto, prioridade_id, coluna, usuario_id} = dadosAtualizados;
        const result = await pool.query(
            'UPDATE tarefas SET texto = $1, prioridade_id = $2, coluna = $3, usuario_id = $4 WHERE id = $5 RETURNING *',
            [texto, prioridade_id || 2, coluna || 'afazer', usuario_id, id]
        );
        return result.rows[0] || null;
    },
    deletarTarefa: async (id) => {
        const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    },
};
