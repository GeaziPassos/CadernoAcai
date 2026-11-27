
import jsPDF from "jspdf";
import {autoTable} from "jspdf-autotable";

interface MaquinaProdutoMensal {
    maquinaId: number;
    tag: string | null;
    linha: number;
    diasTrabalhados: number;
}

interface ProdutoMensal {
    produtoId: number;
    produto: string;
    maquinas: MaquinaProdutoMensal[];
}

interface MaquinaResumoMensal {
    maquinaId: number;
    tag: string | null;
    linha: number;
    diasParados: number;
    percentualParada: number;
}

interface RelatorioMensal {
    mes: number;
    ano: number;
    totalProdutos: number;
    totalMaquinas: number;
    totalDiasComEscala: number;
    produtos: ProdutoMensal[];
    maquinas: MaquinaResumoMensal[];
}

export function gerarRelatorioMensal(dados: RelatorioMensal) {
    const pdf = new jsPDF();

    const nomeMes = new Date(dados.ano, dados.mes - 1)
        .toLocaleString("pt-BR", { month: "long" });

    // Título
    pdf.setFontSize(18);
    pdf.text("CadernoAçaí", 14, 18);

    pdf.setFontSize(14);
    pdf.text("Relatório Mensal de Produtos e Máquinas", 14, 28);

    pdf.setFontSize(11);
    pdf.text(
        `Referência: ${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} de ${dados.ano}`,
        14,
        36
    );

    // Resumo
    pdf.setFontSize(12);
    pdf.text("Resumo do mês", 14, 49);

    autoTable(pdf, {
        startY: 53,
        head: [["Produtos", "Máquinas utilizadas", "Dias com escala"]],
        body: [[
            dados.totalProdutos,
            dados.totalMaquinas,
            dados.totalDiasComEscala
        ]],
        theme: "grid"
    });

    // Produtos por máquina
    let posicaoY = (pdf as any).lastAutoTable.finalY + 15;

    pdf.setFontSize(12);
    pdf.text("Produtos por máquina", 14, posicaoY);

    const linhasProdutos: (string | number)[][] = [];

    dados.produtos.forEach((produto) => {
        if (produto.maquinas.length === 0) {
            linhasProdutos.push([
                produto.produto,
                "-",
                0
            ]);
            return;
        }

        produto.maquinas.forEach((maquina) => {
            linhasProdutos.push([
                produto.produto,
                maquina.tag ?? `Máquina ${maquina.maquinaId}`,
                maquina.diasTrabalhados
            ]);
        });
    });

    autoTable(pdf, {
        startY: posicaoY + 5,
        head: [["Produto", "Máquina", "Dias associados"]],
        body: linhasProdutos,
        theme: "grid",
        didDrawPage: () => {}
    });

    // Máquinas paradas
    posicaoY = (pdf as any).lastAutoTable.finalY + 15;

    if (posicaoY > 250) {
        pdf.addPage();
        posicaoY = 20;
    }

    pdf.setFontSize(12);
    pdf.text("Máquinas paradas", 14, posicaoY);

    const linhasMaquinas = dados.maquinas.map((maquina) => [
        maquina.tag ?? `Máquina ${maquina.maquinaId}`,
        maquina.linha,
        maquina.diasParados,
        `${maquina.percentualParada.toFixed(1)}%`
    ]);

    autoTable(pdf, {
        startY: posicaoY + 5,
        head: [["Máquina", "Linha", "Dias parados", "Percentual parado"]],
        body: linhasMaquinas,
        theme: "grid"
    });

    // Numeração das páginas
    const totalPaginas = pdf.getNumberOfPages();

    for (let i = 1; i <= totalPaginas; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.text(
            `Página ${i} de ${totalPaginas}`,
            pdf.internal.pageSize.getWidth() - 35,
            pdf.internal.pageSize.getHeight() - 10
        );
    }

    pdf.save(`relatorio-mensal-${dados.mes}-${dados.ano}.pdf`);
}
