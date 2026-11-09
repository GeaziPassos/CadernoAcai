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