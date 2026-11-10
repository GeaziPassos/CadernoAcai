import type { Request, Response } from "express";
import * as maquinarRepository from "./maquinaRepository.js";

export async function create (req: Request, res: Response) {
    const {linha, tag} = req.body;
    
    const maquina = await maquinarRepository.create({
        linha: linha.trim(),
        tag: tag.trim()
    });

    return res.json(maquina);
}

export async function readAll(req: Request, res: Response) {
    const maquinas = await maquinarRepository.readAll();

    return res.json(maquinas);
}