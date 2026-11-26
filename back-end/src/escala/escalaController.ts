
import type { Request, Response } from "express";

import * as escalaRepository from "./escalaRepository.js";

import type { NovaEscala } from "./escalaTypes.js";


export async function buscarPorData(req: Request, res: Response) {

    try {

        const data = Array.isArray(req.params.data)
            ? req.params.data[0]
            : req.params.data;

        if (!data) {
            return res.status(400).json({
                mensagem: "Data não informada."
            });
        }

        const escala = await escalaRepository.buscarPorData(data);

        if (!escala) {
            return res.status(200).json({
                maquinas: [],
                salvoEm: null
            });
        }

        return res.status(200).json(escala);

    } catch (erro) {

        console.error("Erro ao buscar escala:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao buscar escala."
        });

    }

}


export async function salvar(req: Request, res: Response) {

    try {

        const data = Array.isArray(req.params.data)
            ? req.params.data[0]
            : req.params.data;

        if (!data) {
            return res.status(400).json({
                mensagem: "Data não informada."
            });
        }   

        const dados: NovaEscala = {
            data,
            maquinas: req.body.maquinas
        };

        if (!data) {
            return res.status(400).json({
                mensagem: "Data não informada."
            });
        }

        // Impede salvar escalas de dias anteriores
        const hoje = new Date();

        const dataHoje =
            `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

        if (data < dataHoje) {
            return res.status(400).json({
                mensagem: "Não é permitido alterar escalas de datas passadas."
            });
        }

        if (!Array.isArray(dados.maquinas)) {
            return res.status(400).json({
                mensagem: "Formato de escala inválido."
            });
        }

        // Verifica se existem pessoas repetidas
        const pessoasEscaladas = dados.maquinas.flatMap(
            maquina => maquina.pessoas
        );

        if (new Set(pessoasEscaladas).size !== pessoasEscaladas.length) {
            return res.status(400).json({
                mensagem: "Uma pessoa não pode estar em mais de uma máquina."
            });
        }

        const escala = await escalaRepository.salvar(dados);

        return res.status(200).json(escala);

    } catch (erro) {

        console.error("Erro ao salvar escala:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao salvar escala."
        });

    }

}
