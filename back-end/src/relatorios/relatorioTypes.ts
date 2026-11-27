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



export interface AtividadePessoa {
    pessoaId: number;
    pessoa: string;
    produtoId: number;
    produto: string;
    diasTrabalhados: number;
}

export interface AlertaAtividade {
    pessoaId: number;
    pessoa: string;
    produtoId: number;
    produto: string;
    vezes: number;
}

export interface RodizioPessoa {
    pessoaId: number;
    pessoa: string;
    escalasConsecutivas: number;
}