const { json, parametroId } = require("./comum");

const paths = {
  "/prioridades": {
    get: {
      tags: ["Prioridades"],
      summary: "Lista todas as prioridades",
      responses: {
        200: { description: "Listar prioridades" },
      },
    },
  },
};

module.exports = { paths };
