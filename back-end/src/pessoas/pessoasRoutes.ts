import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();
import connection from "../../db.js"

//CREATE
router.post('/', async (req: Request, res: Response) => {

    try{
        const {nome, dupla_id} = req.body;
        
        const resultado = await connection.query(
            `INSERT INTO public.pessoa (nome, dupla_id)
            VALUES ($1, $2)
            RETURNING  *`,
            [nome, dupla_id ?? undefined]
        );
        
        res.status(201).json(resultado.rows[0]);   
    } catch (err) {
        console.error(err);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar pessoa'
        });
    };

});

export default router;