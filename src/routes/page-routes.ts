import { Router } from "express";
import { savePage, getPage } from "../controllers/page-controller";
import { auth } from "../middleware/auth";

const router = Router();
// create and edit page
router.post("/edit",auth, savePage);
router.get("/:slug", getPage);

export default router;

