const criarErro = require("../src/utils/criarErro");

const traduzirErroPrisma = require("../src/utils/traduzirErroPrisma");
const P2003 = {
  code: "P2003",
};
const P2025 = {
  code: "P2025",
};
test("1. criarErro: deve criar um erro interno no servidor", () => {
  const erro = criarErro(500, "Erro interno do servidor");
  expect(erro.status).toBe(500);
  expect(erro.detalhes).toBeUndefined();
  expect(erro.message).toBe("Erro interno do servidor");
});

test("2. P2003: ao atualizar (PUT) vira 400 ", () => {
  const erro = traduzirErroPrisma(P2003, "PUT");
  expect(erro.status).toBe(400);
  expect(erro.message).toBe("Um dos ids informados não existe");
});
test("3. P2025: É um erro de registro não encontrado, vira 404", () => {
  const erro = traduzirErroPrisma({ code: "P2025" }, "PUT");
  expect(erro.status).toBe(404);
  expect(erro.message).toBe("Registro não encontrado");
});
test("4. P2003: ao excluir(DELETE) tem a mensagem Não é possível excluir: existem registros ligados a este", () => {
  const erro = traduzirErroPrisma(P2003, "DELETE");
  expect(erro.status).toBe(409);
  expect(erro.message).toBe(
    "Não é possível excluir: existem registros ligados a este",
  );
});
