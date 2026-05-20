import { Router } from "express";
import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import * as documentController from "../controllers/document.js";
import * as accessController from "../controllers/access.js";
import { authenticate, requirePersona } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: env.UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// Creator routes
router.post(
  "/",
  authenticate,
  requirePersona("creator"),
  // upload.single("file"),
  documentController.create,
);
router.get(
  "/:id",
  authenticate,
  requirePersona("creator", "owner"),
  // upload.single("file"),
  documentController.getOne,
);
router.delete(
  "/:id",
  authenticate,
  requirePersona("creator"),
  documentController.remove,
);
router.patch(
  "/:id/mint",
  authenticate,
  requirePersona("creator"),
  documentController.mint,
);

// Owner routes
router.get(
  "/",
  authenticate,
  requirePersona("owner", "creator"),
  documentController.list,
);
router.get(
  "/:id/viewers",
  authenticate,
  requirePersona("owner"),
  accessController.listViewers,
);
router.post(
  "/:id/viewers",
  authenticate,
  requirePersona("owner"),
  accessController.grant,
);
router.delete(
  "/:id/viewers/:viewerId",
  authenticate,
  requirePersona("owner"),
  accessController.revoke,
);
router.get(
  "/:id/access-logs",
  authenticate,
  requirePersona("owner"),
  accessController.listLogs,
);

// Shared (owner + creator can view document detail)
router.get(
  "/:id",
  authenticate,
  requirePersona("owner", "creator"),
  documentController.getOne,
);

// Viewer routes
router.post(
  "/:id/sign",
  authenticate,
  requirePersona("viewer"),
  accessController.sign,
);

router.get(
  "/owners/:ownerWallet",
  authenticate,
  requirePersona("creator"),
  documentController.getOwners,
);

export default router;
