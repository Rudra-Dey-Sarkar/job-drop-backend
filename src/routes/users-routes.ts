import { Router } from "express";
import { auth } from "../middleware/auth";
import { retrieveCompany, retrieveCompanyList } from "../controllers/users-controller";

const router = Router();
// company list
router.get("/companies/list", retrieveCompanyList);
// single list
router.get("/companies/open/:slug", retrieveCompany);
// single list
router.get("/companies/open", auth, retrieveCompany);

export default router;
