document.addEventListener("DOMContentLoaded", function() {
    carregarTabela();
});

console.log("carregou")

async function carregarTabela(){
    const resposta = await fetch("../../api/api.php");
    const json = await resposta.json();
    console.log(json)

    const linha = document.getElementById("tabela");
    json.forEach(element => {
        const elemento = document.createElement("tr")

        elemento.innerHTML = `<td>${element.id}</td><td>${element.nome}</td><td>${element.tipo}</td><td>${element.quantidadeColaboradores}</td>`;
        linha.appendChild(elemento);
    });

}