const express = require("express");

const usuariosRoutes = require("./src/routes/usuarios.routes");
const tarefasRoutes = require("./src/routes/tarefas.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");

const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(validarContentType);
app.use(logger);

app.use("/usuarios", usuariosRoutes);
app.use("/tarefas", tarefasRoutes);
app.use("/projetos", projetosRoutes);

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada :( " });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
