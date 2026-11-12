const validar = require("../src/middlewares/validar");
const schemas = require("../src/middlewares/schemas");

function pegarErro(funcao) {
  try {
    funcao();
  } catch (error) {
    return error;
  }
}

function tarefaValida() {
  return {
    texto: "Definir tabelas do banco",
    coluna: "afazer",
    usuario_id: 8,
    projeto_id: 8,
    prioridade_id: 8,
  };
}
describe("validar ", () => {
  test("chama o next quando os dados estão certos", () => {
    const middleware = validar(schemas.tarefa);
    const req = { body: { ...tarefaValida() } };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.message).toBe("Dados inválidos");
    expect(erro.detalhes).toEqual([
      "O campo 'coluna' deve ser um de: afazer, andamento, concluido",
    ]);
  
    expect(erro.status).toBe(400);
    expect(erro.message).toBe("Dados inválidos");
    expect(erro.detalhes).toEqual([
      "O campo 'texto' é obrigatório!",
      "O campo 'prioridade_id' é obrigatório!",
      "O campo 'coluna' é obrigatório!",
      "O campo 'usuario_id' é obrigatório!",
      "O campo 'projeto_id' é obrigatório!",
    ]);
    expect(next).not.toHaveBeenCalled();
});
  /* test('id da URL: aceita "7" e barra "abc"', () => {
    const middleware = validar(schemas.id, 'params');
    const next = 

  }*/
});
