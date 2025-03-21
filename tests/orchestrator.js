import retry from "async-retry";

// Esse arquivo irá tentar contra o endpoint http://localhost:3000/api/v1/status até obter resposta
//significando que o servidor subiu.
async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer(bail, trynumber) {
    return retry(fetchStatusPage, {
      retries: 100, // Quantas tentativa irá fazer antes de desistir
      maxTimeout: 1000, // Tempo máximo de espera entre tentativas
    });

    // esse parametros vem do retry, bail é abortar, se true, não tenta mais. trynumber são as 100 tentativas vindas do retry
    async function fetchStatusPage(bail, tryNumber) {
      // console.log(tryNumber); // imprime em qual tentativa está no momento
      const response = await fetch("http://localhost:3000/api/v1/status");
      // Se a resposta do json não for 200 estouramos um erro
      if (response.status != 200) {
        throw Error();
      }
    }
  }
}

export default {
  waitForAllServices,
};
