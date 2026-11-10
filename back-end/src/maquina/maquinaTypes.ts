export interface Maquina{
    id: number;
    linha: number;
    tag: string;
    ativo: boolean;
}

export interface NovaMaquina{
    linha: number;
    tag: string;
}