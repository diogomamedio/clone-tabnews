import database from "infra/database.js"; // pode usar o import porque jest.configr.js configurou para ler ESM
import orchestrator from "tests/orchestrator.js";

// Função jest para executar antes de qualquer teste
beforeAll(async () => {
  await orchestrator.waitForAllServices(); // prende a execução até que o retorno do endpoint do orchestrator seja valido
  // limpa o banco de dados para rodar as migrações
  await database.query("DROP schema public CASCADE; CREATE schema public;");
});

test("Get to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  // Espera que a resposta será um array
  expect(Array.isArray(responseBody)).toBe(true);
  // Espera que esse array seja maior que zero
  expect(responseBody.length).toBeGreaterThan(0);
});
