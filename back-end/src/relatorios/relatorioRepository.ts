
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



import type {
    AtividadePessoa,
    AlertaAtividade,
    RodizioPessoa
} from "./relatorioTypes.js";

export async function buscarAtividades(
    inicio: string,
    fim: string
): Promise<{
    atividades: AtividadePessoa[];
    alertas: AlertaAtividade[];
}> {

    // Histórico de atividades dentro do período
    const atividadesResult = await pool.query(
        `
        SELECT
            p.id AS pessoa_id,
            p.nome AS pessoa,
            pr.id AS produto_id,
            pr.nome AS produto,
            COUNT(DISTINCT e.id)::integer AS dias_trabalhados

        FROM escala e

        INNER JOIN escala_maquina em
            ON em.escala_id = e.id

        INNER JOIN escala_pessoa ep
            ON ep.escala_maquina_id = em.id

        INNER JOIN pessoa p
            ON p.id = ep.pessoa_id

        INNER JOIN produto pr
            ON pr.id = em.produto_id

        WHERE e.data BETWEEN $1 AND $2

        GROUP BY
            p.id,
            p.nome,
            pr.id,
            pr.nome

        ORDER BY
            p.nome ASC,
            dias_trabalhados DESC
        `,
        [inicio, fim]
    );

    const atividades: AtividadePessoa[] =
        atividadesResult.rows.map(row => ({
            pessoaId: row.pessoa_id,
            pessoa: row.pessoa,
            produtoId: row.produto_id,
            produto: row.produto,
            diasTrabalhados: row.dias_trabalhados
        }));

    // Alertas considerando as últimas 5 escalas
    const alertasResult = await pool.query(
        `
        WITH ultimas_escalas AS (
            SELECT id
            FROM escala
            WHERE data <= $1
            ORDER BY data DESC
            LIMIT 5
        )

        SELECT
            p.id AS pessoa_id,
            p.nome AS pessoa,
            pr.id AS produto_id,
            pr.nome AS produto,
            COUNT(DISTINCT e.id)::integer AS vezes

        FROM ultimas_escalas ue

        INNER JOIN escala e
            ON e.id = ue.id

        INNER JOIN escala_maquina em
            ON em.escala_id = e.id

        INNER JOIN escala_pessoa ep
            ON ep.escala_maquina_id = em.id

        INNER JOIN pessoa p
            ON p.id = ep.pessoa_id

        INNER JOIN produto pr
            ON pr.id = em.produto_id

        GROUP BY
            p.id,
            p.nome,
            pr.id,
            pr.nome

        HAVING COUNT(DISTINCT e.id) >= 3

        ORDER BY vezes DESC
        `,
        [fim]
    );

    const alertas: AlertaAtividade[] =
        alertasResult.rows.map(row => ({
            pessoaId: row.pessoa_id,
            pessoa: row.pessoa,
            produtoId: row.produto_id,
            produto: row.produto,
            vezes: row.vezes
        }));

    return {
        atividades,
        alertas
    };
}



export async function buscarRodizio(
    data: string
): Promise<RodizioPessoa[]> {

    // Busca todas as escalas anteriores à data informada
    const escalasResult = await pool.query(
        `
        SELECT
            e.id AS escala_id,
            ep.pessoa_id

        FROM escala e

        LEFT JOIN escala_pessoa ep
            ON ep.escala_id = e.id

        WHERE e.data <= $1

        ORDER BY
            e.data DESC,
            e.id DESC
        `,
        [data]
    );

    // Organiza as pessoas escaladas em cada dia
    const escalasMap = new Map<number, Set<number>>();

    for (const row of escalasResult.rows) {

        if (!escalasMap.has(row.escala_id)) {
            escalasMap.set(row.escala_id, new Set());
        }

        if (row.pessoa_id !== null) {
            escalasMap.get(row.escala_id)!.add(row.pessoa_id);
        }
    }

    // Busca todas as pessoas ativas
    const pessoasResult = await pool.query(
        `
        SELECT id, nome
        FROM pessoa
        WHERE ativo = true
        ORDER BY nome ASC
        `
    );

    const rodizio: RodizioPessoa[] = [];

    // Conta as escalas consecutivas de cada pessoa
    for (const pessoa of pessoasResult.rows) {

        let consecutivas = 0;

        for (const pessoasEscaladas of escalasMap.values()) {

            if (pessoasEscaladas.has(pessoa.id)) {
                consecutivas++;
            } else {
                break;
            }
        }

        rodizio.push({
            pessoaId: pessoa.id,
            pessoa: pessoa.nome,
            escalasConsecutivas: consecutivas
        });
    }

    // Ordena da maior sequência para a menor
    rodizio.sort(
        (a, b) => b.escalasConsecutivas - a.escalasConsecutivas
    );

    return rodizio;
}
