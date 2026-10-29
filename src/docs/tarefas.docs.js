const { json, parametroId } = require("./comum");

const paths = {
  "/tarefas": {
    get: {
      tags: ["Tarefas"],
      summary: "Lista todas as tarefas",
      responses: {
        200: { description: "Lista de tarefas" },
      },
    },
  },
  "/tarefas/{id}": {
    get: {
      tags: ["Tarefas"],
      summary: "Busca uma tarefa pelo id",
      parameters: [parametroId],
      responses: {
        200: { description: "Tarefa encontrada", content: json("Tarefa") },

        400: { description: "Id inválido", content: json("Erro") },
        401: {
          description: "Token ausente ou inválido",
          content: json("Erro"),
        },
        404: { description: "Tarefa não encontrada", content: json("Erro") },
      },
    },
  },
};
const schemas = {
  Tarefa: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      texto: { type: "string", example: "Revisar layout" },
      coluna: { type: "string", enum: ["afazer", "andamento", "concluido"] },
      iniciado_em: { type: "string", format: "date-time", nullable: true },
    },
  },
};

module.exports = { paths, schemas };
