import { Router } from "express";
import { savePage, getPage } from "../controllers/page-controller";
import { auth } from "../middleware/auth";

const router = Router();
// create and edit page
router.post("/page/edit",auth, savePage);
// get public page
router.get("/page/:slug", getPage);

export default router;

