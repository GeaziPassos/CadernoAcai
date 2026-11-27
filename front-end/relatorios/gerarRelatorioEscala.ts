
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface MaquinaRelatorio {
    id: number;
    tag: string | null;
    linha: number;
    produto: string | null;
    pessoas: string[];
    parada: boolean;
}

interface RelatorioEscalaDiaria {
    data: string;
    maquinas: MaquinaRelatorio[];
    disponiveis: string[];
    totalDisponiveis: number;
}

export function gerarRelatorioEscala(dados: RelatorioEscalaDiaria) {

    const pdf = new jsPDF();

    // Cabeçalho
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("CadernoAçaí", 14, 20);

    pdf.setFontSize(14);
    pdf.text("Escala de Produção", 14, 30);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Data: ${dados.data}`, 14, 38);

    // Tabela de máquinas
    autoTable(pdf, {
        startY: 48,
        head: [["Máquina", "Pessoas escaladas", "Produto"]],
        body: dados.maquinas.map(maquina => [
            maquina.tag ?? `Máquina ${maquina.id}`,
            maquina.parada ? "PARADA" : maquina.pessoas.join(", "),
            maquina.produto ?? "-"
        ]),
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [40, 40, 40]
        },
        didParseCell: (dataCell) => {
            if (
                dataCell.section === "body" &&
                Array.isArray(dataCell.row.raw) &&
                dataCell.row.raw[1] === "PARADA"
            ) {
                dataCell.cell.styles.textColor = [200, 0, 0];
                dataCell.cell.styles.fontStyle = "bold";
            }
        }
    });

    // Posição após a tabela
    const posicaoFinal = (pdf as any).lastAutoTable.finalY + 12;

    // Pessoas disponíveis
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
        `Pessoas disponíveis: ${dados.totalDisponiveis}`,
        14,
        posicaoFinal
    );

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    if (dados.disponiveis.length > 0) {
        const nomes = dados.disponiveis.join(", ");

        const linhas = pdf.splitTextToSize(nomes, 180);

        pdf.text(linhas, 14, posicaoFinal + 8);
    } else {
        pdf.text("Nenhuma pessoa disponível.", 14, posicaoFinal + 8);
    }

    // Rodapé
    const totalPaginas = pdf.getNumberOfPages();

    for (let i = 1; i <= totalPaginas; i++) {
        pdf.setPage(i);

        pdf.setFontSize(8);
        pdf.text(
            `CadernoAçaí - Página ${i} de ${totalPaginas}`,
            14,
            pdf.internal.pageSize.height - 10
        );
    }

    // Download do PDF
    pdf.save(`escala-${dados.data}.pdf`);
}
