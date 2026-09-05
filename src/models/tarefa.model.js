let tarefas = [
  { id: 1, texto: "Estudar JSX", prioridade: "media", coluna: "afazer", usuarioId: 1, projetoId:1},
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento", usuarioId: 2, projeto: 2},
  { id: 3, texto: "Testar Postman", prioridade: "alta", coluna: "concluido", usuarioId: 3, projeto: 3},
];
let proximoId = 4;
module.exports = { 
    listarTarefas: () => tarefas,
    listarTarefasPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),
    listarTarefasPorPrioridade: (prioridade) => tarefas.filter((t) => t.prioridade === prioridade),

    listarPorUsuario: (usuarioId) => tarefas.filter((t) => t.usuarioId === usuarioId),
    buscarUsuarioPorId: (usuarioId) => tarefas.find((t) => t.usuarioId === usuarioId),

    buscarTarefaPorId: (id) => tarefas.find((t) => t.id === id),
    criarTarefa: (tarefaNova) => {
        const {texto, prioridade, coluna, usuarioId, projetoId} = tarefaNova;
        const novaTarefa = { id: proximoId++, texto, prioridade, coluna, usuarioId, projetoId };
        tarefas.push(novaTarefa);
        return novaTarefa;
    },   
    atualizarTarefa: ( id, tarefaNova )=> {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        tarefas[indice] = { ...tarefas[indice], ...tarefaNova, id };
        return tarefas[indice];
    },
    deletarTarefa: (id) => {
        const indice = tarefas.findIndex((t) => t.id === id);
        if (indice === -1) return null;
        return tarefas.splice(indice, 1)[0];
    },
};
