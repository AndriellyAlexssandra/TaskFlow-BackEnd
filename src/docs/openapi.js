const tarefas = require("./tarefas.docs");
const comum = require("./comum");

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description: "API do TaskFlow - SENAI CTGAS-ER",
  },

  servers: [{ url: "http://localhost:3001", description: "Local" }],
  security: [{ bearerAuth: [] }],
  paths: { ...tarefas.paths },

  components: {
    securitySchemes: {
      bearerAuth: {
        schemas: { ...comum.schemas, ...tarefas.schemas },
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        
      },
    },
  },
};
