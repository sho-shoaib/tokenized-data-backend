import { Router } from "express";
import authRouter from "./auth.js";
import collectionRouter from "./collection.js";
import documentRouter from "./document.js";
import viewerRouter from "./viewer.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/collections", collectionRouter);
router.use("/documents", documentRouter);
router.use("/viewers", viewerRouter);

export default router;
