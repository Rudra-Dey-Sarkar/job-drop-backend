import express from "express";
import cors from "cors";
import auth from "./routes/auth-routes";
import pages from "./routes/page-routes";
import jobs from "./routes/job-routes";
import application from "./routes/application-routes";
import users from "./routes/users-routes";

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", auth);
app.use("/", pages);
app.use("/", jobs);
app.use("/", application);
app.use("/", users);

export default app;
