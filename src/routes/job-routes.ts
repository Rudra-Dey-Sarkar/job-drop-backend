import { Router } from "express";
import { addJob, retrieveJobList, retrieveJob, editJob, deleteJob } from "../controllers/job-controller";
import { auth } from "../middleware/auth";

const router = Router();
// create job
router.post("/jobs", auth, addJob);
// retrieve job list
router.get("/jobs/list/:slug", retrieveJobList);
// retrieve job
router.get("/jobs/open/:id", retrieveJob);
// edit job
router.put("/jobs/:id", auth, editJob);
// delete job
router.delete("/jobs/:id", auth, deleteJob);

export default router;

