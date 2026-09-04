let projetos = [
  { id: 1, nome: "Projeto 1", descricao: "Cadastro de funcionários" },
  { id: 2, nome: "Projeto 2", descricao: "Cadastro de usuários" },
  { id: 3, nome: "Projeto 3", descricao: "Cadastro de projetos" },
];
let proximoId = 4;
module.exports = {
    listarProjetos: () => projetos,
    buscarProjetoPorId: (id) => projetos.find((p) => p.id === id),
    criarProjeto: (nome, descricao) => {
        const novoProjeto = { id: proximoId, nome, descricao };
        projetos.push(novoProjeto);
        proximoId++;
        return novoProjeto;
    }, 
    atualizarProjeto: (id, nome, descricao) => {
        const indice = projetos.findIndex((p) => p.id === id);
        if (indice === -1) return null;
        projetos[indice] = { id, nome, descricao };
        return projetos[indice];
    }, 
    deletarProjeto: (id) => {
        const indice = projetos.findIndex((p) => p.id === id);
        if (indice === -1) return null;
        return projetos.splice(indice, 1)[0];
    }
  }
  