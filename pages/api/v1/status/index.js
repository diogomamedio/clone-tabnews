function status(request, response) {
  response.status(200).json({ chave: "Tudo Ok na comunicação com o servidor" });
}

export default status;
