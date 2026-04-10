import { Router } from "express";
import * as collectionController from "../controllers/collection.js";
import { authenticate, requirePersona } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requirePersona("creator"));

router.get("/", collectionController.list);
router.post("/", collectionController.create);
router.get("/:id", collectionController.getOne);
router.put("/:id", collectionController.update);
router.delete("/:id", collectionController.remove);

export default router;
