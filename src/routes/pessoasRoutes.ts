import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();
import connection from "../../db.js"

//CREATE
router.post('/', (req: Request, res: Response)=>{

    const {nome, duplaID} = req.body;

    connection.query(
        'CALL inserirPessoa(?,?)',
        [nome, duplaID],
        err =>{
            if(err) return res.status(500).json(err);
            res.json({mensagem: 'Cliente cadastrado com sucesso'})
        }
    );
})

export default router;