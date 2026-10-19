const prioridadesModel = require("../models/prioridades.model");

const prioridadesController = {
    async listarPrioridades(req, res) {
        res.json(await prioridadesModel.listarPrioridades());
    }   
}
module.exports = prioridadesController;