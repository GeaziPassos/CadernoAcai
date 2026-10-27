interface Pessoa {
    id: number;
    nome: string;
}

async function readAll(): Promise<void> {
    try {
        const resposta = await fetch("http://localhost:3006/pessoas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar pessoas");
        }

        const pessoas: Pessoa[] = await resposta.json();

        const tabela = document.getElementById("tabela");

        if (!tabela) {
            console.error("Tabela não encontrada");
            return;
        }

        tabela.innerHTML = "";

        pessoas.forEach((pessoa) => {
            const linha = document.createElement("tr");

            const colunaId = document.createElement("td");
            colunaId.textContent = String(pessoa.id);

            const colunaNome = document.createElement("td");
            colunaNome.textContent = pessoa.nome;

            linha.appendChild(colunaId);
            linha.appendChild(colunaNome);

            tabela.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao listar pessoas:", error);
    }
}

readAll();