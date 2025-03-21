const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    // Se retornar -1, significa que não achou a mensagem de conexão
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres(); // Se o banco não está pronto , tenta novamente
      return; // encerra o programa, serve para interromper a execução da função caso o PostgreSQL ainda não esteja aceitando conexões.
    }
    console.log("\n🟢 Postgres pronto e aceitando conexões\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando postgres aceitar conexões");
checkPostgres();
