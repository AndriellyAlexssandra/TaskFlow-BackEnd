const traduzirErroPrisma = require("../src/utils/traduzirErroPrisma");

const erroP2002 = {
  code: "P2002",
  meta: { target: ["email"] },
};
const erroP2003 = {
  code: "P2003",
};

test("P2002: (valor repetido)vira 409 e diz qual campo é", () => {
  const erro = traduzirErroPrisma(erroP2002);
  expect(erro.status).toBe(409);
  expect(erro.detalhes).toEqual(["Valor repetido em: email"]);
});
test("P2003: ao gravar (POST) vira 400", () => {
  expect(traduzirErroPrisma(erroP2003, "POST").status).toBe(400);
});
test("P2003: ao excluir (DELETE) vira 409", () => {
  expect(traduzirErroPrisma(erroP2003, "DELETE").status).toBe(409);
});
test("P2025: registro não encontrado vira 404", () => {
  const erro = traduzirErroPrisma({ code: "P2025" }, "PUT");
  expect(erro.status).toBe(404);
});
test("código não tratado fica sem status (o tratarErros responde 500)", () => {
  const erroPrisma = { code: "P1001", message: "banco fora do ar" };
  const erro = traduzirErroPrisma(erroPrisma, "GET");
  expect(erro.status).toBeUndefined();
});
