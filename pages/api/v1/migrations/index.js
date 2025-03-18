import migrationRunner from "node-pg-migrate";
//metodo para converter caminhos entre sistemas operacionais
import { join } from "node:path";
import database from "infra/database";

//Exporto a função diretamente ao invés do final
export default async function migrations(request, response) {
  const allowedMethod = ["GET", "POST"];
  if (!allowedMethod.includes(request.method)) {
    return response
      .status(405)
      .json({ message: `Método "${request.method}" não permitido` });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      // databaseUrl propriedade do node-pg-migrate que define as credencias para se conectar ao banco.
      // databaseUrl: process.env.DATABASE_URL,

      dbClient: dbClient, // Substutui a propriedade databaseUrl com o cliente do banco de dados vindo do database.js
      // simula migrações sem realmente executa-las
      dryRun: true,
      // define o diretorio onde estão os arquivos de migração
      dir: join("infra", "migrations"),
      // executa as migrações em ordem ascendente
      direction: "up",
      // mostra mais informações sobre as migrações
      verbose: true,
      // Define o nome da tabela que armazena as migrações
      migrationsTable: "pgmigrations", // nome usado por convenção
    };

    //Verifico se o método é GET
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions, // spread são os ... são usados para copiar todas as propriedades do objeto defaultMigrationsOptions
        // sobrescreve o valor true que veio em defaultMigrationsOptions.
        dryRun: false, // Executa as migrações contra o Banco
      });
      // Se houverem migrações pendentes retorne 201
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
