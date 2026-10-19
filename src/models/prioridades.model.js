const db = require("../database/db");

const prioridadesModel = {
    listarPrioridades: async () => {
        const result = await db.query
        ("SELECT * FROM prioridades ORDER BY id");
        return result.rows;
    }
};
module.exports = prioridadesModel;