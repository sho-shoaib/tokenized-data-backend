import { Router } from "express";
import * as viewerController from "../controllers/viewer.js";
import { authenticate, requirePersona } from "../middleware/auth.js";

const router = Router();

// Owner: list all viewers available to share with
router.get("/", authenticate, requirePersona("owner"), viewerController.listViewers);

// Viewer: list documents shared with me
router.get("/documents", authenticate, requirePersona("viewer"), viewerController.myDocuments);

export default router;
