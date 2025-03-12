import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    // Usa dotenv para pegar essas variáveis de ambiente
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    // O acesso será feito SEM SSL em desevolvimento pois muito bancos não suportam
    ssl: getSSLValues(),
  });
  //sem o Try... toda vez que uma consulta der errado ficará uma conexão aberta.
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  // Verifica se tem a variavel de Ambiente para usar certificado SSL privado
  if (process.env.POSTGRES_CA) {
    console.log(process.env.POSTGRES_CA);
    return {
      rejectUnauthorized: false, // Permite certificados autoassinados
      ca: process.env.POSTGRES_CA,
    };
  }
  // Verifica se é produção para usar SSL
  return process.env.NODE_ENV === "development" ? false : true;
}
