document.addEventListener("DOMContentLoaded", function() {
    carregarTabela();
});

async function carregarTabela(){
    const resposta = await fetch("../../api/ColaboradorAPI.php");
    const dados = await resposta.json();
    console.log(dados);

    const linha = document.getElementById("tabela");
    dados.forEach(element => {
        const elemento = document.createElement("tr");

        elemento.innerHTML = `<td>${element.id}</td><td>${element.nome}</td><td>${""}</td><td>${element.bica}</td><td>${element.fecharCaixa}</td>`
        linha.appendChild(elemento);
    });
    
}