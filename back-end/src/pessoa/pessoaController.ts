import type { Request, Response } from "express";
import * as pessoaRepository from "./pessoaRepository.js";

import type { Pessoa } from "./pessoaTypes.js"

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

export async function update(req: Request, res: Response) {

    const pessoa: Pessoa = {
        id: Number(req.body.pessoa.id),
        nome: String(req.body.pessoa.nome),
        ativo: Boolean(req.body.pessoa.ativo)
    }

    //Resultado é o que o Repository retorna apos a funcao ser chamada (se deu certo ou nao)
    const resultado = await pessoaRepository.update(pessoa);

    //é o resultado que vai retornar para requisicao que foi feita no front end
    return await res.status(200).json(resultado)
}

export async function readAll(req: Request, res: Response) {
    try{
        const pessoas = await pessoaRepository.readAll();

        return res.status(200).json(pessoas);
    }catch (error) {
        console.log("Erro ao listar pessoa", error);

        return res.status(500).json({
            mensagem: "Erro ao listar pessoas"
        });
    };
}

export async function deactivate(req: Request, res: Response) {

    const id = Number(req.body.id);

    const pessoa = await pessoaRepository.deactivate(id)

    return res.status(200).json(pessoa);
}

export async function reactivate(req: Request, res: Response) {

    const id = Number(req.body.id);

    const pessoa = await pessoaRepository.reactivate(id);

    return res.status(200).json(pessoa);
}