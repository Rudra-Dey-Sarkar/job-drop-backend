import { Router } from "express";
import { addJob, retrieveJobList, retrieveJob, editJob, deleteJob } from "../controllers/job-controller";
import { auth } from "../middleware/auth";

const router = Router();
// create job
router.post("/", auth, addJob);
// retrieve job list
router.get("/list/:slug", retrieveJobList);
// retrieve job
router.get("/open/:id", retrieveJob);
// edit job
router.put("/:id", auth, editJob);
// delete job
router.delete("/:id", auth, deleteJob);

export default router;

