document.addEventListener("DOMContentLoaded", function() {
    carregarTabela();
});

async function carregarTabela(){
    const resposta = await fetch("../../api/MaquinaAPI.php");
    const dados = await resposta.json();
    console.log(dados); 

    const linha = document.getElementById("tabela");
    dados.forEach(element => {
        const elemento = document.createElement("tr");
        
        elemento.innerHTML = `<td>${element.id}</td><td>${element.linha}</td><td>${element.produtora}</td>`;
        linha.appendChild(elemento);
    });

}
