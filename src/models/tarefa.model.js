const pool = require("../database/db");
const prisma = require("../database/prisma");

const incluirNomes = {
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
  prioridades: { select: { descricao: true, cor: true } },
};
function formatarTarefa(tarefa) {
  const { projetos, usuarios, prioridades, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?.descricao,
  };
}
module.exports = {
  listarTarefas: async () => {
    const lista = await prisma.tarefas.findMany({
      select: {
        id: true,
        texto: true,
        coluna: true,
        usuario_id: true,
        projeto_id: true,
        prioridade_id: true,
        criado_em: true,
        finalizado_em: true,
        iniciado_em: true,
        ordem: true,
        ...incluirNomes,
      },
      orderBy: { id: "asc" },
    });
    return lista.map(formatarTarefa);
  },
  listarTarefasPorColuna: async (coluna) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE coluna = $1", [
      coluna,
    ]);
    return result.rows;
  },
  listarTarefasPorPrioridade: async (prioridade) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE prioridade = $1",
      [prioridade],
    );
    return result.rows;
  },

  listarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1",
      [usuarioId],
    );
    return result.rows;
  },
  buscarUsuarioPorId: async (usuarioId) => {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      usuarioId,
    ]);
    return result.rows[0] || null;
  },

  buscarTarefaPorId: async (id) => {
    const result = await prisma.tarefas.findUnique({
      where: { id: id },
      select: {
        id: true,
        texto: true,
        coluna: true,
        usuario_id: true,
        projeto_id: true,
        prioridade_id: true,
        criado_em: true,
        finalizado_em: true,
        iniciado_em: true,
        ordem: true,
        ...incluirNomes,
      },
    });
    return result ? formatarTarefa(result) : null;
  },
  criarTarefa: async ({
    texto,
    prioridade_id,
    coluna,
    usuario_id,
    projeto_id,
    ordem,
  }) => {
    const tarefa = await prisma.tarefas.create({
      data: {
        texto: texto,
        prioridade_id: prioridade_id || 2,
        coluna: coluna || "afazer",
        usuario_id: usuario_id,
        projeto_id: projeto_id,
        ordem: ordem || 0,
      },
      include: incluirNomes,
    });
    return formatarTarefa(tarefa);
  },

  atualizarTarefa: async (id, dadosAtualizados) => {
    const tarefaAtual = await prisma.tarefas.findUnique({
      where: { id: id },
    });
    if (!tarefaAtual){
      return null;
    }
    /*if (tarefaAtual.rows.length === 0) {
      return null;
    }*/
    const finalizadoEm =
      dadosAtualizados.coluna === "concluido" ? new Date() : null;

    let iniciadoEm = tarefaAtual.rows[0].iniciado_em;

    if (
      tarefaAtual.rows[0].coluna === "em andamento" &&
      dadosAtualizados.coluna === "afazer"
    ) {
      iniciadoEm = null;
    } else if (
      tarefaAtual.rows[0].coluna === "afazer" &&
      dadosAtualizados.coluna === "em andamento"
    ) {
      iniciadoEm = new Date();
    }
    const tarefaAtualizada = await prisma.tarefas.update({
      where: { id: id },
      data: {
        texto: dadosAtualizados.texto,
        coluna: dadosAtualizados.coluna,
        usuario_id: dadosAtualizados.usuario_id,
        projeto_id: dadosAtualizados.projeto_id,
        prioridade_id: dadosAtualizados.prioridade_id,
        criado_em: criado_em,
        iniciado_em: iniciadoEm,
        finalizado_em: finalizadoEm,
        ordem: dadosAtualizados.ordem,
      },
    });
    return formatarTarefa(tarefaAtualizada);
  },
  deletarTarefa: async (id) => {
    try {
      const tarefa = await prisma.tarefas.delete({
        where: { id },
        include: incluirNomes,
      });
      return formatarTarefa(tarefa);
    } catch (erro) {
      if (erro.code === "P2025") {
        return null;
      }
      throw erro;
    }
  },
};
