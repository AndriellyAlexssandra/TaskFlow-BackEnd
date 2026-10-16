const schemas = {
  id: {
    id: { obrigatorio: true, tipo: "inteiro" },
  },
  tarefa: {
    texto: { obrigatorio: true, tipo: "string", minLength: 3 },
    prioridade_id: {
      obrigatorio: true,
      tipo: "inteiro",
    },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    usuario_id: { obrigatorio: false, tipo: "inteiro" },
    projeto_id: { obrigatorio: false, tipo: "inteiro" },
  },
  usuario: {
    nome: { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha_hash: { obrigatorio: true, tipo: "string", minLength: 6 },
  },
  projeto: {
    nome: { obrigatorio: true, tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string", maxLength: 200 },
    usuario_id: { obrigatorio: true, tipo: "inteiro" },
  },
};

module.exports = schemas;
