
import type { Request, Response } from "express";
import * as relatorioRepository from "./relatorioRepository.js";

export async function escalaDiaria(req: Request, res: Response) {
    try {
        const data = req.params.data;

        if (!data || Array.isArray(data)) {
            return res.status(400).json({
                mensagem: "Data inválida."
            });
        }

        const relatorio = await relatorioRepository.escalaDiaria(data);

        if (!relatorio) {
            return res.status(404).json({
                mensagem: "Não existe escala cadastrada para essa data."
            });
        }

        return res.status(200).json(relatorio);

    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar os dados do relatório."
        });
    }
}
