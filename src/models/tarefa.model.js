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
    listarTarefasPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),
    listarTarefasPorPrioridade: (prioridade) => tarefas.filter((t) => t.prioridade === prioridade),

    listarPorUsuario: (usuarioId) => tarefas.filter((t) => t.usuarioId === usuarioId),
    buscarUsuarioPorId: (usuarioId) => tarefas.find((t) => t.usuarioId === usuarioId),

    buscarTarefaPorId: async (id) => {
        const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    criarTarefa: async ({ texto, prioridade, coluna, usuarioId, projetoId }) => {
        const result = await pool.query(
            'INSERT INTO tarefas (texto, prioridade, coluna, usuarioId, projetoId) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [texto, prioridade || 'media', coluna || 'afazer' , usuarioId, projetoId]
        );
        return result.rows[0];
    },
    atualizarTarefa: async (id, dadosAtualizados) => {
        const { texto, prioridade, coluna, usuarioId} = dadosAtualizados;
        const result = await pool.query(
            'UPDATE tarefas SET texto = $1, prioridade = $2, coluna = $3, usuarioId = $4 WHERE id = $5 RETURNING *',
            [texto, prioridade, coluna, usuarioId, id]
        );
        return result.rows[0] || null;
    },
    deletarTarefa: async (id) => {
        const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    },
};
