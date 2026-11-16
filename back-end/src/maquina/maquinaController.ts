import type { Request, Response } from "express";
import * as maquinaRepository from "./maquinaRepository.js";

export async function create (req: Request, res: Response) {
    const {linha, tag} = req.body;
    
    const maquina = await maquinaRepository.create({
        linha: linha.trim(),
        tag: tag.trim()
    });

    return res.json(maquina);
}

export async function readAll(req: Request, res: Response) {
    const maquinas = await maquinaRepository.readAll();

    return res.json(maquinas);
}
export async function deactivate(req: Request, res: Response) {
    const id = Number(req.body.id);


    const desativar = await maquinaRepository.deactivate(id);

    return res.json(desativar)
}

export async function reactivate(req: Request, res: Response) {
    const id = Number(req.body.id);

    const ativar = await maquinaRepository.reactivate(id);
    return res.json(ativar);
}

export async function update(req: Request, res: Response) {
    const dados = {
        id: Number(req.body.id),
        linha: Number(req.body.linha),
        tag: String(req.body.tag),
        ativo: Boolean(req.body.ativo)
    }

    const update = await maquinaRepository.update(dados);

    return res.json(update)
}