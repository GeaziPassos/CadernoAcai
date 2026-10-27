interface Usuario {
    id: number;
    nome: string;
    ativo: boolean;
}

async function carregarUsuarios(): Promise<void> {
    const resposta = await fetch("http://localhost:3006/pessoa");

    const usuarios: Usuario[] = await resposta.json();

    const tabela = document.getElementById("tabela");

    if (!tabela) return;

    tabela.innerHTML = "";

    usuarios.forEach((usuario) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
        `;

        tabela.appendChild(linha);
    });
}

carregarUsuarios();