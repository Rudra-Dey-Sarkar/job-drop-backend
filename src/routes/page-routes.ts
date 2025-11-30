import { Router } from "express";
import { savePage, getPage } from "../controllers/page-controller";
import { auth } from "../middleware/auth";

const router = Router();
// create and edit page
router.post("/:slug/edit",auth, savePage);
// preview page
router.get("/:slug/preview",auth, getPage);
// get public page
router.get("/:slug/careers", getPage);

export default router;

