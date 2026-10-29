   const botaoCadastrar = document.getElementById("btn-cadastrar")!;
  const modalCadastro = document.getElementById("modal-cadastro") as HTMLDialogElement;
  const botaoCancelar = document.getElementById("btn-cancelar")!;
  
  botaoCadastrar.addEventListener("click", () => {
    modalCadastro.showModal();
  });
  
  botaoCancelar.addEventListener("click", () => {
    modalCadastro.close();
  });