
import pool from "./../../db.js";
import type { MaquinaRelatorio, RelatorioEscalaDiaria } from "./relatorioTypes.js";

export async function escalaDiaria(
    data: string
): Promise<RelatorioEscalaDiaria | null> {

    // 1. Verifica se existe uma escala para a data
    const escalaResult = await pool.query(
        `
        SELECT id
        FROM escala
        WHERE data = $1
        `,
        [data]
    );

    if (escalaResult.rows.length === 0) {
        return null;
    }

    const escalaId = escalaResult.rows[0].id;

    // 2. Busca todas as máquinas ativas e suas informações na escala
    const maquinasResult = await pool.query(
        `
        SELECT
            m.id,
            m.tag,
            m.linha,
            pr.nome AS produto,
            p.id AS pessoa_id,
            p.nome AS pessoa_nome

        FROM maquina m

        LEFT JOIN escala_maquina em
            ON em.maquina_id = m.id
            AND em.escala_id = $1

        LEFT JOIN produto pr
            ON pr.id = em.produto_id

        LEFT JOIN escala_pessoa ep
            ON ep.escala_maquina_id = em.id
            AND ep.escala_id = $1

        LEFT JOIN pessoa p
            ON p.id = ep.pessoa_id

        WHERE m.ativo = true

        ORDER BY
            m.linha ASC,
            m.tag ASC NULLS LAST,
            p.nome ASC
        `,
        [escalaId]
    );

    // 3. Organiza as pessoas dentro de cada máquina
    const maquinasMap = new Map<number, MaquinaRelatorio>();

    for (const row of maquinasResult.rows) {

        if (!maquinasMap.has(row.id)) {
            maquinasMap.set(row.id, {
                id: row.id,
                tag: row.tag,
                linha: row.linha,
                produto: row.produto,
                pessoas: [],
                parada: true
            });
        }

        const maquina = maquinasMap.get(row.id)!;

        if (row.pessoa_id !== null) {
            maquina.pessoas.push(row.pessoa_nome);
            maquina.parada = false;
        }
    }

    const maquinas = Array.from(maquinasMap.values());

    // 4. Busca as pessoas disponíveis
    const disponiveisResult = await pool.query(
        `
        SELECT
            p.id,
            p.nome

        FROM pessoa p

        WHERE p.ativo = true

        AND NOT EXISTS (
            SELECT 1
            FROM escala_pessoa ep
            WHERE ep.pessoa_id = p.id
            AND ep.escala_id = $1
        )

        ORDER BY p.nome ASC
        `,
        [escalaId]
    );

    const disponiveis = disponiveisResult.rows.map(
        pessoa => pessoa.nome
    );

    // 5. Retorna os dados organizados
    return {
        data,
        maquinas,
        disponiveis,
        totalDisponiveis: disponiveis.length
    };
}
