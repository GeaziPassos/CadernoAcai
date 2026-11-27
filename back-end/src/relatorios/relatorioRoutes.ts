
import { Router } from "express";
import * as relatorioController from "./relatorioController.js";

const router = Router();

router.get("/escala/:data", relatorioController.escalaDiaria);

export default router;
