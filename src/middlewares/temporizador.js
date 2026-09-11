/*function temporizador(req, res, next) {
  const inicalizacao = Date.now();
  res.on("finish", () => {
    const duracao = Date.now() - inicalizacao;
    console.log(`[🕐] ${req.method} ${req.originalUrl} -- ${duracao}ms`);
  });
  next();
}
module.exports = temporizador;*/
