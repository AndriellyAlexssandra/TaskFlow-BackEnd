const db = require("../database/db");
const prisma = require("../database/prisma");

const prioridadesModel = {
  listarPrioridades: async () => {
    return prisma.prioridades.findMany({
      where: { ativo: true },
      select: { id: true, descricao: true },
      orderBy: { id: "asc" },
    });
  },
};
module.exports = prioridadesModel;
