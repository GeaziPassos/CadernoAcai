
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



export async function buscarAtividades(req: Request, res: Response) {
    try {
        const inicio = req.query.inicio;
        const fim = req.query.fim;

        if (
            typeof inicio !== "string" ||
            typeof fim !== "string"
        ) {
            return res.status(400).json({
                mensagem: "Informe uma data inicial e uma data final válidas."
            });
        }

        if (inicio > fim) {
            return res.status(400).json({
                mensagem: "A data inicial não pode ser maior que a data final."
            });
        }

        const relatorio = await relatorioRepository.buscarAtividades(
            inicio,
            fim
        );

        return res.status(200).json(relatorio);

    } catch (erro) {
        console.error("Erro ao buscar atividades:", erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar o histórico de atividades."
        });
    }
}



export async function buscarRodizio(req: Request, res: Response) {
    try {
        const data = req.query.data;

        if (typeof data !== "string") {
            return res.status(400).json({
                mensagem: "Informe uma data válida."
            });
        }

        const rodizio = await relatorioRepository.buscarRodizio(data);

        return res.status(200).json(rodizio);

    } catch (erro) {
        console.error("Erro ao buscar rodízio:", erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar o rodízio de pessoas."
        });
    }
}



export async function buscarRelatorioMensal(req: Request, res: Response) {
    try {
        const mes = Number(req.query.mes);
        const ano = Number(req.query.ano);

        if (
            !Number.isInteger(mes) ||
            mes < 1 ||
            mes > 12 ||
            !Number.isInteger(ano) ||
            ano < 1
        ) {
            return res.status(400).json({
                mensagem: "Mês ou ano inválido."
            });
        }

        const relatorio = await relatorioRepository.buscarRelatorioMensal(
            mes,
            ano
        );

        return res.status(200).json(relatorio);

    } catch (erro) {
        console.error("Erro ao buscar relatório mensal:", erro);

        return res.status(500).json({
            mensagem: "Erro ao gerar relatório mensal."
        });
    }
}