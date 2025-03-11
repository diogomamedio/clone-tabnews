import database from "infra/database.js";
async function status(request, response) {
  // retorna a data atual em ISO8601
  const updatedAt = new Date().toISOString();

  // Retorna a versão do banco
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  // Retorna atividades no banco postgres
  const databaseName = process.env.POSTGRES_DB;

  // Usando a sanatizaçao de banco do node-postgres
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count; // número de conexões abertas no postgres

  response.status(200).json({
    status: "ok",
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
