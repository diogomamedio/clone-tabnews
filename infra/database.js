import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    // Usa dotenv para pegar essas variáveis de ambiente
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });
  await client.connect();
  console.log("Credencias do Postgres: ", {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });
  //sem o Try... toda vez que uma consulta der errado ficará uma conexão aberta.
  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
