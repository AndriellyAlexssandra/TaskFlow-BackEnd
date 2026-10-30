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
    if (!tarefaAtual) {
      return null;
    }

    const novaColuna = dadosAtualizados.coluna ?? tarefaAtual.coluna;

    let iniciadoEm = tarefaAtual.iniciado_em;
    if (tarefaAtual.coluna !== "andamento" && novaColuna === "andamento") {
      iniciadoEm = new Date();
    } else if (tarefaAtual.coluna === "andamento" && novaColuna === "afazer") {
      iniciadoEm = null;
    }

    const finalizadoEm =
      novaColuna === "concluido"
        ? (tarefaAtual.finalizado_em ?? new Date())
        : null;

    const tarefaAtualizada = await prisma.tarefas.update({
      where: { id: id },
      data: {
        texto: dadosAtualizados.texto,
        coluna: novaColuna,
        usuario_id: dadosAtualizados.usuario_id,
        projeto_id: dadosAtualizados.projeto_id,
        prioridade_id: dadosAtualizados.prioridade_id,
        iniciado_em: iniciadoEm,
        finalizado_em: finalizadoEm,
        ordem: dadosAtualizados.ordem,
      },
      include: incluirNomes,
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
