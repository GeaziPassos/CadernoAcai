import { Router } from "express";
import * as produtoController from "./produtoController.js";

const router = Router();

router.post("/", produtoController.create);
router.get("/", produtoController.readAll);
router.patch("/deactivate", produtoController.deactivate);
router.patch("/reactivate", produtoController.reactivate);
router.put("/update", produtoController.update)

export default router;