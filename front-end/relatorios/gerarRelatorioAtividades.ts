
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface AtividadePessoa {
    pessoaId: number;
    pessoa: string;
    produtoId: number;
    produto: string;
    diasTrabalhados: number;
}

interface AlertaAtividade {
    pessoaId: number;
    pessoa: string;
    produtoId: number;
    produto: string;
    vezes: number;
}

interface RodizioPessoa {
    pessoaId: number;
    pessoa: string;
    escalasConsecutivas: number;
}

interface DadosRelatorio {
    atividades: AtividadePessoa[];
    alertas: AlertaAtividade[];
    rodizio: RodizioPessoa[];
    inicio: string;
    fim: string;
}

function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

export function gerarRelatorioAtividades(dados: DadosRelatorio) {

    const pdf = new jsPDF();

    const largura = pdf.internal.pageSize.getWidth();

    // Cabeçalho
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("CadernoAçaí", 14, 18);

    pdf.setFontSize(14);
    pdf.text("Relatório de Atividades e Rodízio", 14, 28);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(
        `Período: ${formatarData(dados.inicio)} até ${formatarData(dados.fim)}`,
        14,
        36
    );

    // 1. Atividades
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("1. Atividades por pessoa", 14, 48);

    autoTable(pdf, {
        startY: 53,
        head: [["Pessoa", "Produto", "Dias trabalhados"]],
        body: dados.atividades.map(item => [
            item.pessoa,
            item.produto,
            String(item.diasTrabalhados)
        ]),
        theme: "grid",
        styles: {
            fontSize: 9
        },
        headStyles: {
            fillColor: [45, 65, 55]
        }
    });

    let y = (pdf as any).lastAutoTable.finalY + 15;

    // 2. Alertas
    if (y > 250) {
        pdf.addPage();
        y = 20;
    }

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("2. Alertas de repetição", 14, y);

    autoTable(pdf, {
        startY: y + 5,
        head: [["Pessoa", "Produto", "Ocorrências nas últimas 5 escalas"]],
        body: dados.alertas.length > 0
            ? dados.alertas.map(item => [
                item.pessoa,
                item.produto,
                String(item.vezes)
            ])
            : [["Nenhum alerta encontrado", "", ""]],
        theme: "grid",
        styles: {
            fontSize: 9
        },
        headStyles: {
            fillColor: [150, 75, 45]
        }
    });

    y = (pdf as any).lastAutoTable.finalY + 15;

    // 3. Rodízio
    if (y > 250) {
        pdf.addPage();
        y = 20;
    }

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("3. Rodízio", 14, y);

    autoTable(pdf, {
        startY: y + 5,
        head: [["Pessoa", "Escalas consecutivas"]],
        body: dados.rodizio.map(item => [
            item.pessoa,
            String(item.escalasConsecutivas)
        ]),
        theme: "grid",
        styles: {
            fontSize: 9
        },
        headStyles: {
            fillColor: [45, 65, 55]
        }
    });

    // Rodapé com numeração
    const totalPaginas = pdf.getNumberOfPages();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        pdf.setPage(pagina);

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");

        pdf.text(
            `Página ${pagina} de ${totalPaginas}`,
            largura - 14,
            290,
            { align: "right" }
        );
    }

    pdf.save(`relatorio-atividades-${dados.inicio}-a-${dados.fim}.pdf`);
}
