import pool from "../../db.js"
import type { NovaPessoa, Pessoa } from "./pessoaTypes.js";

export async function create(dados: NovaPessoa): Promise<Pessoa> {
    const resultado = await pool.query(
         `
         INSERT INTO pessoa (nome)
         VALUES ($1)
         RETURNING id, nome, ativo
         `,
         [dados.nome]
    )
    return resultado.rows[0];
}


export async function deactivate(id: number): Promise<boolean> {
    const resultado = await pool.query(
        `
        UPDATE pessoa
        SET ativo = false
        WHERE id = $1
        `,
        [id]
    )
    return resultado.rowCount !== null && resultado.rowCount > 0;
}


export async function update(dados: Pessoa): Promise<Pessoa | null>
{
    const resultado = await pool.query(
        `
        UPDATE pessoa
        SET nome = $1
        WHERE id = $2
        RETURNING id, nome, ativo
        `,
        [dados.nome, dados.id]
    )
    return resultado.rows[0] ?? null;
}


export async function read(id: number): Promise<Pessoa | null> {
    const resultado = await pool.query(
        `
        SELECT * FROM pessoa
        WHERE id = $1
        `,
        [id]
    )

    return resultado.rows[0] ?? null;
}

export async function readAll(): Promise<Pessoa[]> {
    const resultado = await pool.query(
        `
        SELECT * FROM pessoa
        `
    )

    return resultado.rows;
}