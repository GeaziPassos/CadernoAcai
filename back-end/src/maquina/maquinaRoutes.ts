import { Router } from "express";
import * as maquinaController from "./maquinaController.js";

const router = Router();

router.post("/", maquinaController.create);
router.get("/", maquinaController.readAll);
router.patch("/deactivate", maquinaController.deactivate);
router.patch("/reactivate", maquinaController.reactivate);
router.put("/update", maquinaController.update);

export default router;