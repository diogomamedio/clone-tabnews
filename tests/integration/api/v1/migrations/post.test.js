import database from "infra/database.js"; // pode usar o import porque jest.configr.js configurou para ler ESM

beforeAll(cleanDatabase); // Função jest para executar antes de qualquer teste
// limpa o banco de dados para rodar as migrações
async function cleanDatabase() {
  await database.query("DROP schema public CASCADE; CREATE schema public;");
}

// Executa migrations pendentes
test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  // Espera que a resposta será um array
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  // A resposta 2 espera que não haja nenhuma migration a ser rodada, pois foi executada acima
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  // Espera que a resposta será um array
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
