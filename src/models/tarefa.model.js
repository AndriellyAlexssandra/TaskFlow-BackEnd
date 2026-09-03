let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido" },
];
let proximoId = 4;
module.exports = { 
    listarTarefas: () => tarefas,
    listarTarefasPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),
    listarTarefasPorPrioridade: (prioridade) => tarefas.filter((t) => t.prioridade === prioridade),
    buscarPorId: (id) => tarefas.find((t) => t.id === id),
    criarTarefa: (texto, prioridade, coluna) => {
        const novaTarefa = { id: proximoId++, texto, prioridade, coluna };
        tarefas.push(novaTarefa);
        return novaTarefa;
    },   
    atualizarTarefa: (id, texto, prioridade, coluna) => {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        tarefas[indice] = { id, texto, prioridade, coluna };
        return tarefas[indice];
    },
    deletarTarefa: (id) => {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        return tarefas.splice(indice, 1)[0];
    },
};
