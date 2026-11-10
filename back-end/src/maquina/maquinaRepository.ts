import pool from "../../db.js"
import type {NovaMaquina, Maquina} from "./maquinaTypes.js";

export async function create(dados: NovaMaquina): Promise<Maquina>{
    const resultado = await pool.query(
        `
        INSERT INTO maquina (linha, tag)
        VALUES ($1, $2)
        RETURNING id, linha, tag, ativo
        ` ,
        [dados.linha, dados.tag,]
    );

    return resultado.rows[0];
}

export async function deactivate(id: number): Promise<boolean> {
    const resultado = await pool.query(
        `
        UPDATE maquina
        SET ativo = false
        WHERE id = $1
        `,
        [id]

    )
    return resultado.rowCount !== null && resultado.rowCount > 0
}

export async function update(dados: Maquina): Promise<Maquina | null> {
    const resultado = await pool.query(
        `
        UPDATE maquina
        SET linha = $1, tag = $2
        WHERE id = $3
        RETURNING id, linha, tag, ativo
        `,
        [dados.linha, dados.tag, dados.id]
    );

    return resultado.rows[0] ?? null;
}

export async function read(id: number): Promise<Maquina | null>{
    const resultado = await pool.query(
      `
      SELECT * FROM maquina
      WHERE id = $1
      `,
      [id]
    );

    return resultado.rows[0] ?? null;
}

export async function readAll(): Promise<Maquina[]> {
    const resultado = await pool.query(
        `
        SELECT * FROM maquina
        `
    )

    return resultado.rows;
}