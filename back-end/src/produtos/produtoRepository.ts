import pool from "../../db.js";
import type {NovoProduto, Produto} from "./produtoTypes.js";

export async function create(dados: NovoProduto): Promise<Produto> {
    const resultado = await pool.query(
        `
        INSERT into produto (nome)
        values ($1)
        RETURNING id, nome, ativo
        `,
        [dados.nome]
    )

    return resultado.rows[0];
}

export async function deactivate(id: number): Promise<boolean> {
    const resultado = await pool.query(
        `
        UPDATE produto
        SET ativo = false
        WHERE id = $1
        `,
        [id]
    );

    return resultado.rowCount !== null && resultado.rowCount > 0
}

export async function update(dados: Produto): Promise<Produto | null> {
    const resultado = await pool.query(
        `
        UPDATE produto
        SET nome = $1
        WHERE id = $2
        RETURNING id, nome, ativo
        `,
        [dados.nome, dados.id]
    )

    return resultado.rows[0] ?? null;
}

export async function read(id: number): Promise<Produto | null> {
    const resultado = await pool.query(
        `
        SELECT * FROM produto
        WHERE id = $1
        `,
        [id]
    )

    return resultado.rows[0] ?? null
}

export async function readAll(): Promise<Produto[]> {
    const resultado = await pool.query(
        `
        SELECT * FROM produto
        `
    )

    return resultado.rows;
}