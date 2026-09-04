let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "afazer", usuarioId: 1 },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento", usuarioId: 2 },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido", usuarioId: 3 },
];
let proximoId = 4;
module.exports = { 
    listarTarefas: () => tarefas,
    listarTarefasPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),
    listarTarefasPorPrioridade: (prioridade) => tarefas.filter((t) => t.prioridade === prioridade),
    buscarTarefaPorId: (id) => tarefas.find((t) => t.id === id),
    buscarUsuarioPorId: (usuarioId) => tarefas.find((t) => t.usuarioId === usuarioId),
    criarTarefa: (texto, prioridade, coluna, usuarioId) => {
        const novaTarefa = { id: proximoId++, texto, prioridade, coluna, usuarioId };
        tarefas.push(novaTarefa);
        return novaTarefa;
    },   
    atualizarTarefa: (id, texto, prioridade, coluna, usuarioId) => {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        tarefas[indice] = { id, texto, prioridade, coluna, usuarioId };
        return tarefas[indice];
    },
    deletarTarefa: (id) => {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        return tarefas.splice(indice, 1)[0];
    },
};
