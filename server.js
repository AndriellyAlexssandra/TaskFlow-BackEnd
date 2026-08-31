const express = require("express");

const app = express();
const PORTA = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "concluido" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido" },
];
let usuarios = [
  { id: 1, nome: "francisca", email: "francisca@gmail.com", senha: "francis1" },
  { id: 2,nome: "minguado",email: "minguado@outlook.com",senha: "minguado6" },
  { id: 3, nome: "cleidiana", email: "cleidiana@opera.com", senha: "bolinho0" },
];
let proximoIdUsuario = 4;

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});
app.get("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }
  res.json(usuario);
});

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatorios" });
  }
  const emailExiste = usuarios.find((u) => u.email === email);
  if (emailExiste) {
    return res.status(400).json({ erro: "Este email já existe!" });
  }
  const novoUsuario = {
    id: proximoIdUsuario,
    nome: nome,
    email: email,
    senha: senha,
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.put("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  const emailExiste = usuarios.find(
    (u) => u.email === req.body.email && u.id !== id,
  );
  if (emailExiste) {
    return res.status(400).json({ erro: "Este email já existe!" });
  }

  const indice = usuarios.findIndex((u) => u.id === id);
  if (indice === -1) {
    return res
      .status(404)
      .json({ erro: "Usuário não encontrado :/" });
  }
  const usuarioAtualizado = { id, nome, email, senha };
  usuarios[indice] = usuarioAtualizado;

  res.json(usuarioAtualizado);
});
app.delete("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado :/" });
  }
  usuarios = usuarios.filter((u) => u.id !== id);
  res.json({ mensagem: "Usuário removido com sucesso!", id });
});

let proximoId = 4;
app.post("/tarefas", (req, res) => {
  const { texto, prioridade, coluna, cidade } = req.body;
  const novaTarefa = {
    id: proximoId++,
    texto: texto,
    prioridade: prioridade || "media",
    coluna: coluna || "afazer",
    cidade: cidade || " ",
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;

  const indice = tarefas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
  }
  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  res.json(tarefaAtualizada);
});

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/ " });
  }
  tarefas = tarefas.filter((t) => t.id !== id);

  res.json({ mensagem: "Tarefa removida com sucesso!", id });
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

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada :/" });
  }
  res.json(tarefa);
});

app.get("/tarefas", (req, res) => {
  const { coluna, prioridade } = req.query;
  let resultado = tarefas;
  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }
  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }

  res.json(resultado);
});

function encontrarComum(objetoContagem) {
  const entradas = Object.entries(objetoContagem); 
  if (entradas.length === 0) return null;

  entradas.sort((a, b) => b[1] - a[1]); 
  return entradas[0][0]; 
}

app.get("/estatisticas/resumo", (req, res) => {
  const { coluna } = req.query;

  const tarefasFiltradas = coluna? tarefas.filter((t) => t.coluna === coluna): tarefas;

  const total = tarefasFiltradas.length;

  if (total === 0) {
    const mensagem = coluna
      ? `Nenhuma tarefa encontrada na coluna "${coluna} :/"`
      : "Você ainda não tem nenhuma tarefa, Que tal criar a primeira?";
    return res.json({ resumo: mensagem });
  }

  const concluidas = tarefasFiltradas.filter((t) => t.coluna === "concluido").length;
  const andamento = tarefasFiltradas.filter((t) => t.coluna === "andamento").length;
  const afazer = tarefasFiltradas.filter((t) => t.coluna === "afazer").length;

  const contagemPrioridade = {
    alta: tarefasFiltradas.filter((t) => t.prioridade === "alta").length,
    media: tarefasFiltradas.filter((t) => t.prioridade === "media").length,
    baixa: tarefasFiltradas.filter((t) => t.prioridade === "baixa").length,
  };
  const prioridadeComum = encontrarComum(contagemPrioridade);

  const resumo = `Você tem ${total} tarefa(s), ${concluidas} concluída(s), ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComum}.`;

  res.json({ resumo });
});

app.get("/estatisticas", (req, res) => {
  const { coluna } = req.query;

  const tarefasFiltradas = coluna? tarefas.filter((t) => t.coluna === coluna): tarefas;

  const totalTarefas = tarefasFiltradas.length;

  const porColuna = {
    afazer: tarefasFiltradas.filter((t) => t.coluna === "afazer").length,
    andamento: tarefasFiltradas.filter((t) => t.coluna === "andamento").length,
    concluido: tarefasFiltradas.filter((t) => t.coluna === "concluido").length,
  };

  const porPrioridade = {
    alta: tarefasFiltradas.filter((t) => t.prioridade === "alta").length,
    media: tarefasFiltradas.filter((t) => t.prioridade === "media").length,
    baixa: tarefasFiltradas.filter((t) => t.prioridade === "baixa").length,
  };

  res.json({
    filtroAplicado: coluna || "nenhum",
    total: totalTarefas,
    porColuna,
    porPrioridade,
    prioridadeComum: encontrarComum(porPrioridade),
  });
});

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
