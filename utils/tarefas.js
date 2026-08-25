const tarefas = [];

function listarTodas() {
  return tarefas;
}
function buscarPorId(tarefa) {
  tarefas.push(tarefa);
  return tarefa;
}
function adicionar(tarefa) {
  tarefas.push(tarefa);
  return tarefa;
}
module.exports = { listarTodas, buscarPorId, adicionar };
