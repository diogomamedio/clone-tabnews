const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development", // Define o arquivo que estão as variáveis de ambiente
});
// next/jest é um modulo do next que transfere informações para o jest funcionar
const nextJest = require("next/jest");

// devolve uma função para criar um objeto de configuração do jest
const createJestConfig = nextJest({
  dir: ".", // fornece o caminho para o Netx.js para carregar o next.config.js e carregar arquivos .env dentro do ambiente de teste
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"], // permite que o jest acesse os arquivos do projeto
  testTimeout: 60000, //tempo de espera até um teste terminar, por padrão é de 5 segundos.
});
module.exports = jestConfig;
