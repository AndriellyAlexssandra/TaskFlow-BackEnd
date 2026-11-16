require("dotenv").config();

const express = require("express");

const app = express();

const authRoutes = require("./src/routes/auth.routes");
const autenticar = require("./src/middlewares/autenticar");
const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const prioridadesRoutes = require("./src/routes/prioridades.routes");

const tratarErros = require("./src/middlewares/erro.middleware");
const criarErro = require("./src/utils/criarErro");

const validarContentType = require("./src/middlewares/validarContentType");
const logger = require("./src/middlewares/logger");

const openapi = require("./src/docs/openapi");
const swaggerUi = require("swagger-ui-express");

const cors = require("cors");
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN || "https://task-flow-lake-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);
const SWAGGER_CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14";
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi, {
    customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
  }),
);

app.get("/", (req, res) => {
  res.json({ mensagem: "TaskFlow API funcionando!" });
});

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
app.use("/prioridades", autenticar, prioridadesRoutes);

app.use((req, res) => {
  const rota = `${req.method} ${req.url}`;
  throw criarErro(404, `Rota ${rota} não encontrada!`);
});

app.use(tratarErros);

module.exports = app;
