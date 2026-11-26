import pool from "../../db.js";

import type { NovaEscala, Escala, MaquinaEscala } from "./escalaTypes.js";



export async function salvar(dados: NovaEscala): Promise<Escala> {

    const client = await pool.connect();

    let transacaoIniciada = false;

    try {

        await client.query("BEGIN");
        transacaoIniciada = true;

        // 1. Criar ou atualizar a escala
        const resultadoEscala = await client.query(
            `
            INSERT INTO escala (data)
            VALUES ($1)

            ON CONFLICT (data)
            DO UPDATE SET salvo_em = CURRENT_TIMESTAMP

            RETURNING id, data, salvo_em AS "salvoEm"
            `,
            [dados.data]
        );

        const escala = resultadoEscala.rows[0];

        const escalaId = escala.id;

        // 2. Excluir as máquinas anteriores
        // As pessoas serão excluídas automaticamente pelo CASCADE
        await client.query(
            `
            DELETE FROM escala_maquina
            WHERE escala_id = $1
            `,
            [escalaId]
        );

        // 3. Inserir máquinas e pessoas
        for (const maquina of dados.maquinas) {

            const resultadoMaquina = await client.query(
                `
                INSERT INTO escala_maquina
                    (escala_id, maquina_id, produto_id)

                VALUES ($1, $2, $3)

                RETURNING id
                `,
                [
                    escalaId,
                    maquina.maquinaId,
                    maquina.produtoId
                ]
            );

            const escalaMaquinaId = resultadoMaquina.rows[0].id;

            // 4. Inserir pessoas da máquina
            for (const pessoaId of maquina.pessoas) {

                await client.query(
                    `
                    INSERT INTO escala_pessoa
                        (escala_id, escala_maquina_id, pessoa_id)

                    VALUES ($1, $2, $3)
                    `,
                    [
                        escalaId,
                        escalaMaquinaId,
                        pessoaId
                    ]
                );

            }
        }

        // 5. Confirmar transação
        await client.query("COMMIT");

        return {
            id: escalaId,
            data: escala.data,
            salvoEm: escala.salvoEm,
            maquinas: dados.maquinas
        };

    } catch (erro) {

        if (transacaoIniciada) {
            await client.query("ROLLBACK");
        }

        throw erro;

    } finally {

        client.release();

    }
}




export async function buscarPorData(data: string): Promise<Escala | null> {

    const resultado = await pool.query(
        `
        SELECT
            e.id,
            e.data,
            e.salvo_em AS "salvoEm",

            em.id AS "escalaMaquinaId",
            em.maquina_id AS "maquinaId",
            em.produto_id AS "produtoId",

            ep.pessoa_id AS "pessoaId"

        FROM escala e

        LEFT JOIN escala_maquina em
            ON em.escala_id = e.id

        LEFT JOIN escala_pessoa ep
            ON ep.escala_maquina_id = em.id

        WHERE e.data = $1

        ORDER BY em.maquina_id, ep.pessoa_id
        `,
        [data]
    );

    // Não existe escala nessa data
    if (resultado.rows.length === 0) {
        return null;
    }

    const primeiraLinha = resultado.rows[0];

    const maquinasMap = new Map<number, MaquinaEscala>();

    for (const linha of resultado.rows) {

        // A escala pode existir sem máquinas cadastradas
        if (linha.escalaMaquinaId === null) {
            continue;
        }

        // Verifica se a máquina já foi adicionada
        if (!maquinasMap.has(linha.escalaMaquinaId)) {

            maquinasMap.set(linha.escalaMaquinaId, {
                maquinaId: linha.maquinaId,
                produtoId: linha.produtoId,
                pessoas: []
            });

        }

        // Adiciona a pessoa à máquina correspondente
        if (linha.pessoaId !== null) {

            maquinasMap
                .get(linha.escalaMaquinaId)!
                .pessoas.push(linha.pessoaId);

        }

    }

    return {
        id: primeiraLinha.id,
        data: primeiraLinha.data,
        salvoEm: primeiraLinha.salvoEm,
        maquinas: Array.from(maquinasMap.values())
    };

}
