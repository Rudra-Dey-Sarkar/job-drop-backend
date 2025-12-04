import express from "express";
import cors from "cors";
import auth from "./routes/auth-routes";
import pages from "./routes/page-routes";
import jobs from "./routes/job-routes";
import application from "./routes/application-routes";
import users from "./routes/users-routes";
import { connectDB } from "./config/db";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", auth);
app.use("/", pages);
app.use("/", jobs);
app.use("/", application);
app.use("/", users);


connectDB();

export default app;
