const app = require("./app");
const pool = require("./src/database/db");
const PORTA = process.env.PORTA || 3001;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(
      "Erro ao consultar o servidor do banco de dados:",
      err.message,
    );
  } else {
    console.log(
      "Conexão com o banco de dados estabelecida com sucesso.",
      res.rows[0].now,
    );
  }
});
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
