import { Router } from "express";
import * as maquinaController from "./maquinaController.js";

const router = Router();

router.post("/", maquinaController.create);
router.get("/", maquinaController.readAll);

export default router;