const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("=== AMBIENTE ===");
console.log("Nodde.js:", process.version);
console.log("Sistema:", os.platform());
console.log("Pasta atual:", __dirname);

console.log("");
console.log("=== ARQUIVOS NA PASTA ===");
const arquivos = fs.readdirSync(".");
arquivos.forEach((arquivos) => {
  console.log(" -", arquivos);
});

console.log("");
console.log("=== CAMINHO DO FUTURO SERVIDOR ===");
const caminhoServidor = path.join(__dirname, "src", "server.js");
console.log("O servidor ficara em:", caminhoServidor);

const arquivosJS = arquivos.filter((a) => a.endsWith(".js"));
console.log("");
console.log(`Arquivos .js encontrados: ${arquivosJS.length}`);

const arquivosTaskflow1 = fs.readdirSync("../Taskflow Front -end");
arquivosTaskflow1.forEach((arquivos => {
  console.log(" -", arquivos );
}));
const arquivosJS1 = arquivosTaskflow1.filter(a => a.endsWith('.js'));
console.log('');
console.log(`Arquivos .js encontrados: ${arquivosJS1.length}`);
/*
fs.mkdirSync('teste')//criar pasta
fs.rmdirSync('teste')//deleta pasta;
*/
