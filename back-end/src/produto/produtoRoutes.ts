import { Router } from "express";
import * as produtoController from "./produtoController.js";

const router = Router();

router.post("/", produtoController.create);
router.get("/", produtoController.readAll);

export default router;