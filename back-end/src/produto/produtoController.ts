import type {Request, Response} from "express";
import * as produtoRepository from "./produtoRepository.js";

export async function create(req: Request, res: Response) {
    const {nome} = req.body;

    const produto = await produtoRepository.create({
        nome: nome.trim()
    })

    return res.json(produto);
}

export async function readAll(req: Request, res: Response) {
    const produtos = await produtoRepository.readAll();

    return res.json(produtos);
}

export async function deactivate(req: Request, res: Response) {
    const id = Number(req.body.id);

    const alterarStatus = produtoRepository.deactivate(id);
    
    return res.json(alterarStatus);
}

export async function reactivate(req: Request, res: Response) {
    const id = Number(req.body.id);

    const alterarStatus = produtoRepository.reactivate(id);

    return res.json(alterarStatus);


}

export async function update(req: Request, res: Response) {
    const dados = {
        id: Number(req.body.id),
        nome: String(req.body.nome),
        ativo: Boolean(req.body.ativo)
    }

    return res.json(produtoRepository.update(dados))
}