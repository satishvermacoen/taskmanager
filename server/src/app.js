import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use(cors({
  origin : process.env.CORS_ORIGIN,
  Credentials : true
}));

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// Routes import
import authRouter from "./routes/authuser.routes.js";
import usersRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import reportRoutes from "./routes/report.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportRoutes)



export { app }