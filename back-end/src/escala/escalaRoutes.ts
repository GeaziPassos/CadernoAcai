
import { Router } from "express";

import * as escalaController from "./escalaController.js";

const router = Router();

router.get("/:data", escalaController.buscarPorData);

router.put("/:data", escalaController.salvar);

export default router;
