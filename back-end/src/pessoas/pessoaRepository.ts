import pool from "../../db.js"
import type { NovaPessoa, Pessoa } from "./pessoaTypes.js";

export async function create(dados: NovaPessoa): Promise<Pessoa> {
    const resultado = await pool.query(
         `
         INSERT INTO pessoa (nome)
         VALUES ($1)
         RETURN id, nome, ativo
         `,
         [dados.nome]
    )
    return resultado.rows[0];
}