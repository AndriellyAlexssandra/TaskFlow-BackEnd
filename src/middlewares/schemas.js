const schemas = {
  tarefa: {
    texto: { obrigatorio: true, tipo: "string", minLength: 3 },
    prioridade_id: {
      obrigatorio: true,
      tipo: "number",
    },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    usuario_id: { obrigatorio: false, tipo: "number" },
    projeto_id: { obrigatorio: false, tipo: "number" },
  },
  usuario: {
    nome: { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha_hash: { obrigatorio: true, tipo: "string", minLength: 6 },
  },
  projeto: {
    nome: { obrigatorio: true, tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string", maxLength: 200 },
    usuario_id: { obrigatorio: true, tipo: "number" },
  },
};

module.exports = schemas;
