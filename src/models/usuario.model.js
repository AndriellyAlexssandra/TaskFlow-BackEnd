const pool =  require('../database/db');

let usuarios = [
  { id: 1, nome: "francisca", email: "francisca@gmail.com", senha_hash: "francis1" },
  {
    id: 2,
    nome: "minguado",
    email: "minguado@outlook.com",
    senha_hash: "minguado6",
  },
  { id: 3, nome: "cleidiana", email: "cleidiana@opera.com", senha_hash: "bolinho0" },
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
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
    return result.rows;
  },
  buscarUsuarioPorId: async (id) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  buscarPorEmail: async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0] || null;
  },
  criarUsuario: async (nome, email, senha_hash) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha_hash]
    );
    return result.rows[0];
  },
    /*usuarios.push(novoUsuario);
    proximoIdUsuario++;
    return novoUsuario;
  },*/
  atualizarUsuario: async (id, nome, email, senha_hash) => {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha_hash, id]
    );
    return result.rows[0] || null;
  },
  deletarUsuario: async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  },
};
