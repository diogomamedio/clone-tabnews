import database from "../../../../infra/database.js";
async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  response.status(200).json({ chave: "Tudo Ok na comunicação com o servidor" });
}

export default status;
