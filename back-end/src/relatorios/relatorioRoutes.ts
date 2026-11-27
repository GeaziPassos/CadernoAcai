
import { Router } from "express";
import * as relatorioController from "./relatorioController.js";

const router = Router();

router.get("/escala/:data", relatorioController.escalaDiaria);
router.get("/atividades", relatorioController.buscarAtividades);
router.get("/rodizio", relatorioController.buscarRodizio);
router.get("/mensal", relatorioController.buscarRelatorioMensal);


export default router;
