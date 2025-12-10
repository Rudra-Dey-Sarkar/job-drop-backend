import { Router } from "express";
import { auth } from "../middleware/auth";
import { addApplication, editApplication, retrieveApplication, retrieveApplicationList } from "../controllers/application-controller";

const router = Router();
// create application
router.post("/:id", addApplication);
// edit application
router.put("/:id", auth, editApplication);
// application list
router.get("/list/:id", auth, retrieveApplicationList);
// single application
router.get("/open/:id", auth, retrieveApplication);

export default router;
