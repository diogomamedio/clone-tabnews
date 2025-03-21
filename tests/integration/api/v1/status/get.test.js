import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices(); // prende a execução até que o retorno do endpoint do orchestrator seja valido
});

test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  // Parsing. Converte a resposta do servidor (texto puro) para um objeto JSON
  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  //teste para verificar se o valor é uma data real
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  //versão do banco
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);

  // Verificar maximo de conexões
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
  //console.log(responseBody.max_connections);
});
