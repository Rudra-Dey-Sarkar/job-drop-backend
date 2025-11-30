import { Router } from "express";
import { auth } from "../middleware/auth";
import { retrieveCompany, retrieveCompanyList } from "../controllers/users-controller";

const router = Router();
// company list
router.get("/companies", retrieveCompanyList);
// single application
router.get("/:slug/companies", retrieveCompany);

export default router;
