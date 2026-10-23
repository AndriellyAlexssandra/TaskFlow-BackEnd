const pool =  require('../database/db');

module.exports = {
    listarProjetos: async () => {
        const result = await pool.query('SELECT * FROM projetos');
        return result.rows;
    },
    buscarProjetoPorId: async (id) => {
        const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
        return result.rows[0];
    },
    criarProjeto: async (nome, descricao, usuario_id) => {
        const result = await pool.query('INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *', [nome, descricao, usuario_id]);
        return result.rows[0];
    }, 
    atualizarProjeto: async (id, nome, descricao) => {
        const result = await pool.query('UPDATE projetos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
        return result.rows[0] || null;
    }, 
     deletarProjeto: async (id) => {
        const result = await pool.query('DELETE FROM projetos WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
  }
  