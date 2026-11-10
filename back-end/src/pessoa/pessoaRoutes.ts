import { Router } from "express";
import * as pessoaController from "./pessoaController.js";

const router = Router();

router.post("/", pessoaController.create);
router.get("/", pessoaController.readAll)

export default router;