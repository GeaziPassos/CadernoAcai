import { Router } from "express";
import * as pessoaController from "./pessoaController.js";

const router = Router();

router.post("/", pessoaController.create);
router.get("/", pessoaController.readAll)
router.patch("/desativar", pessoaController.deactivate)
router.patch("/reativar", pessoaController.reactivate);

export default router;