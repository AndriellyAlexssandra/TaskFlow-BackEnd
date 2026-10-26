const pool = require("../database/db");
const prisma = require("../database/prisma");

const incluirNomes = {
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
};
function formatarTarefa(tarefa) {
  const { projetos, usuarios, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
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

        /*prioridades: {
          select: {
            descricao: true,
            cor: true,
          },
        },
        projetos: {
          select: {
            nome: true,
          },
        },

        usuarios: {
          select: {
            nome: true,
          },
        },*/
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
    const tarefa = await prisma.tarefas.findUnique({
      where: { id },
      include: incluirNomes,
    });
    return tarefa ? formatarTarefa(tarefa) : null;
  },
  criarTarefa: async ({
    texto,
    prioridade_id,
    coluna,
    usuario_id,
    projeto_id,
  }) => {
    const result = await pool.query(
      "INSERT INTO tarefas (texto, prioridade_id, coluna, usuario_id, projeto_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [texto, prioridade_id || 2, coluna || "afazer", usuario_id, projeto_id],
    );
    return result.rows[0];
  },

  atualizarTarefa: async (id, dadosAtualizados) => {
    const tarefaAtual = await pool.query(
      "SELECT * FROM tarefas WHERE id = $1",
      [id],
    );

    if (tarefaAtual.rows.length === 0) {
      return null;
    }
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

    const result = await pool.query(
      `UPDATE tarefas SET 
                texto=$1,
                coluna=$2,
                usuario_id=$3,
                projeto_id=$4,
                prioridade_id=$5,
                finalizado_em=$6,
                iniciado_em=$7
            WHERE id=$8 
            RETURNING *`,
      [
        dadosAtualizados.texto,
        dadosAtualizados.coluna,
        dadosAtualizados.usuario_id,
        dadosAtualizados.projeto_id,
        dadosAtualizados.prioridade_id,
        finalizadoEm,
        iniciadoEm,
        id,
      ],
    );

    return result.rows[0] || null;
  },
  deletarTarefa: async (id) => {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
