export interface MaquinaRelatorio {
    id: number;
    tag: string | null;
    linha: number;
    produto: string | null;
    pessoas: string[];
    parada: boolean;
}

export interface RelatorioEscalaDiaria {
    data: string;
    maquinas: MaquinaRelatorio[];
    disponiveis: string[];
    totalDisponiveis: number;
}
