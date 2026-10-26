import type { Request, Response } from "express";
import * as pessoaRepository from "./pessoaRepository.js";

export async function create(req: Request, res: Response) {
    try {
        const { nome } = req.body;

        if (!nome || typeof nome !== "string" || !nome.trim()) {
            return res.status(400).json({
                mensagem: "O nome é obrigatório."
            });
        }

        const pessoa = await pessoaRepository.create({
            nome: nome.trim()
        });

        return res.status(201).json(pessoa);
    } catch (error) {
        console.error("Erro ao cadastrar pessoa:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao cadastrar pessoa."
        });
    }
}