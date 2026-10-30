const { json, parametroId } = require("./comum");

const paths = {
  "/usuarios": {
    get: {
      tags: ["Usuarios"],
      summary: "Lista todos os usuários",
      responses: {
        200: { description: "Listar Usuários" },
      },
    },
    post: {
      tags: ["Usuarios"],
      summary: "Criar um usuário",
      requestBody: { required: true, content: json("UsuarioEntrada") },
      responses: {
        201: { description: "Usuario criado", content: json("Usuario") },
        400: { description: "Dados inválidos", content: json("Erro") },
        401: {
          description: "Token ausente ou inválido",
          content: json("Erro"),
        },
      },
    },
  },
  "/usuarios/{id}": {
    get: {
      tags: ["Usuarios"],
      summary: "Busca usuario pelo id",
      parameters: [parametroId],
      responses: {
        200: { description: "Usuario encontrado", content: json("Usuario") },

        400: { description: "Id inválido", content: json("Erro") },
        401: {
          description: "Token ausente ou inválido",
          content: json("Erro"),
        },
        404: { description: "Usuario não encontrado", content: json("Erro") },
      },
    },
    put: {
      tags: ["Usuarios"],
      summary: "Atualizar um usuario",
      parameters: [parametroId],
      requestBody: { required: true, content: json("UsuarioEntrada") },
      responses: {
        200: { description: "Usuario encontrado", content: json("Usuario") },

        400: { description: "Id inválido", content: json("Erro") },
        401: {
          description: "Token ausente ou inválido",
          content: json("Erro"),
        },
        404: { description: "Usuario não encontrado", content: json("Erro") },
      },
    },
    delete: {
      tags: ["Usuarios"],

      summary: "Exclui um usuario",

      parameters: [parametroId],

      responses: {
        200: {
          description: "Usuario excluído",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: { type: "string", example: "Usuario removido" },

                  usuario: { $ref: "#/components/schemas/Usuario" },
                },
              },
            },
          },
        },

        401: {
          description: "Token ausente ou inválido",
          content: json("Erro"),
        },

        404: { description: "Usuario não encontrado", content: json("Erro") },
      },
    },
  },
};
const schemas = {
  UsuarioEntrada: {
    type: "object",
    required: ["nome", "email", "senha_hash"],
    properties: {
      id: { type: "integer", example: 1 },
      nome: { type: "string", example: "Luzia" },
      email: { type: "string", exemple: "Luzia@email.com"},
      senha_hash: { type: "password", example: "123"}
    },
  },
  Usuario: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      nome: { type: "string", example: "Luzia" },
      email: { type: "string", exemple: "Luzia@email.com"},
      senha_hash: { type: "password"}
    },
  },
};

module.exports = { paths, schemas };
