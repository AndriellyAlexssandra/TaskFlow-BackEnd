const tarefas = require("./tarefas.docs");
const projetos = require("./projetos.docs");
const usuarios = require("./usuarios.docs");
const prioridades = require("./prioridades.docs")
const comum = require("./comum");


module.exports = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API 𐔌՞ ܸ.ˬ.ܸ՞𐦯 ☕︎",
    version: "1.0.0",
    description: "API do TaskFlow ─ SENAI CTGAS-ER ─  Programador Full Stack ˙𐃷˙ ",
  },

  servers: [{ url: "http://localhost:3001", description: "Local" }],
  security: [{ bearerAuth: [] }],
  paths: { ...tarefas.paths, ...projetos.paths, ...usuarios.paths, ...prioridades.paths },

  components: { 
    schemas: { ...comum.schemas, ...tarefas.schemas, ...projetos.schemas, ...usuarios.schemas  },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
    },
  },
};
