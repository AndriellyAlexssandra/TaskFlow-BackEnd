let projetos = [
  { id: 1, nome: "Projeto 1", descricao: "Cadastro de funcionários" },
  { id: 2, nome: "Projeto 2", descricao: "Cadastro de usuários" },
  { id: 3, nome: "Projeto 3", descricao: "Cadastro de projetos" },
];
proximoId = 4;

const projetosController = {
  listarProjetos(req, res) {
    res.json(projetos);
  },
  postarProjetos(req, res) {
    const { nome, descricao } = req.body;
    const novoProjeto = { id: proximoId++, nome, descricao };
    projetos.push(novoProjeto);
    res.status(201).json(novoProjeto);
  },
  buscarProjetoPorId(req, res) {
    const { id } = req.params;
    const projeto = projetos.find((p) => p.id === parseInt(id));
    if (!projeto) {
      return res
        .status(404)
        .json({ message: "Projeto não foi encontrado ou ele não existe :(" });
    }
    res.json(projeto);
  },
  atualizarProjetos(req, res) {
    const { id } = req.params;
    const{ nome, descricao  } = req.body;
    const projetoIndex = projetos.findIndex((p) => p.id === parseInt(id));
    if (projetoIndex === -1) {
        return res.status(404).json({ message: "Esse Projeto não foi encontrado ou ele não existe :(" });
    }
  },
  

};
module.exports = projetosController;
