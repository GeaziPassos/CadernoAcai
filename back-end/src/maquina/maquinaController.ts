import type { Request, Response } from "express";
import * as maquinaRepository from "./maquinaRepository.js";
import type { Maquina } from "./maquinaTypes.js";

export async function create (req: Request, res: Response) {
    const {linha, tag} = req.body;
    
    const maquina = await maquinaRepository.create({
        linha: linha.trim(),
        tag: tag.trim()
    });

    return res.json(maquina);
}

export async function readAll(req: Request, res: Response) {

    const ordem = req.query.ordem === "asc" ? "asc" : "desc"
    const ordemPor = req.query.ordemPor === "linha" ? "linha" : "tag"

    const maquinas = await maquinaRepository.readAll(ordem, ordemPor);

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
    const maquina: Maquina = {
        id: Number(req.body.maquina.id),
        linha: Number(req.body.maquina.linha),
        tag: String(req.body.maquina.tag),
        ativo: Boolean(req.body.maquina.ativo)
    }
    
    const update = await maquinaRepository.update(maquina);

    return res.json(update)
}