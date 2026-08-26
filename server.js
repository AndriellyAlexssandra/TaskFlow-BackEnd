const express = require("express");

const app = express();
const PORTA = 3000;
const tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "concluido" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido" },
];

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});
/*
app.get("/tarefas", (req, res) => {
  console.log(req.headers);
  if (req.headers["tokenapi"] === "93e41bce-c85b-441d-9fc6-9485af865ef3") {
    res.json(tarefas);
  } else {
    res.status(401).json({ erro: "Acesso negado!" });
}
  console.log("baseUrl: ", req.baseUrl);
  console.log("URL: ", req.url);
});*/
app.get("/ok", (req, res) => {
  res.json({ status: "ok", dados: [1, 2, 3] });
});
app.get("/criado", (req, res) => {
  res.status(201).json({ mensagem: "Criado com sucesso" });
});
app.get("/erro", (req, res) => {
  res.status(400).json({ erro: "Dados inválidos" });
});
app.get("/texto", (req, res) => {
  res.send("Resposta em texto simples");
});
//procurar tarefas pelo id
app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  res.json(tarefa);
});

//filtra por coluna com req.query
app.get("/tarefas", (req, res) => {
  const { coluna, prioridade } = req.query;
  let resultado = tarefas;
  if (coluna) {
    resultado = resultado.filter(t => t.coluna === coluna);
  }
  if (prioridade) {
    resultado = resultado.filter(t => t.prioridade === prioridade);
  }
  res.json(resultado);
});

app.get("/usuarios", (req, res) => {
const usuarios = [
  { id: 1, nome: "francisca", email: "francisca@gmail.com" },
  { id: 2, nome: "cleide", email: "cleide@gmail.com" },
]
res.json(usuarios);
})
//Rota 404
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});
app.listen(PORTA, () => console.log(`Porta ${PORTA}`));

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
