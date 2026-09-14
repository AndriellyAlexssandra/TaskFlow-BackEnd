require("dotenv").config();

const express = require("express");

const app = express();
const PORTA = process.env.PORTA || 3001;

const authRoutes = require("./src/routes/auth.routes");
const autenticar = require("./src/middlewares/autenticar");
const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");

const validarContentType = require("./src/middlewares/validarContentType");
const logger = require("./src/middlewares/logger");

const cors = require("cors");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://www.google.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(validarContentType);
app.use(logger);

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "caiu rota nao encontrada :( " });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
