export interface MaquinaEscala {
    maquinaId: number;
    produtoId: number | null;
    pessoas: number[];
}

export interface NovaEscala {
    data: string;
    maquinas: MaquinaEscala[];
}

export interface Escala {
    id: number;
    data: string;
    salvoEm: Date;
    maquinas: MaquinaEscala[];
}
