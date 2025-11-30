import { Router } from "express";
import { auth } from "../middleware/auth";
import { addApplication, editApplication, retrieveApplication, retrieveApplicationList } from "../controllers/application-controller";

const router = Router();
// create application
router.post("/applications/:id", addApplication);
// edit application
router.put("/applications/:id", auth, editApplication);
// application list
router.get("/:slug/applications", auth, retrieveApplicationList);
// single application
router.get("/applications/:id", auth, retrieveApplication);

export default router;
