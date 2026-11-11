const formatarTarefa = require("../src/utils/formatarTarefa");

function tarefaDoPrisma() {
  return {
    id: 1,
    texto: "Definir tabelas do banco",
    coluna: "afazer",
    projetos: { nome: "TaskFlow" },
    usuarios: { nome: "Minguado Lopes" },
    prioridades: { descricao: "Alta", cor: "#EF4444" },
  };
}
test("achata as relações no formato que o  front espera", () => {
  const resultado = formatarTarefa(tarefaDoPrisma());
  expect(resultado).toEqual({
    id: 1,
    texto: "Definir tabelas do banco",
    coluna: "afazer",
    projeto: "TaskFlow",
    usuario: "Minguado Lopes",
    prioridade: "Alta",
    cor: "#EF4444",
  });
});
test("deixa o campo undefined quando não existe a relação", () => {
  const tarefa = tarefaDoPrisma();
  delete tarefa.prioridades;
  const resultado = formatarTarefa(tarefa);
  expect(resultado.prioridade).toBeUndefined();
  expect(resultado.projeto).toBe("TaskFlow");
});

test("não altera a tarefa original", () => {
  const tarefa = tarefaDoPrisma();
  const resultado = formatarTarefa(tarefa);
  expect(resultado).not.toBe(tarefa);
  expect(tarefa).toHaveProperty("projetos", { nome: "TaskFlow" });
});
test("lança TypeError se receber null", () => {
  expect(() => formatarTarefa(null)).toThrow(TypeError);
});
