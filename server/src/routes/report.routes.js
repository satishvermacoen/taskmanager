import { Router } from "express";
import { adminOnly, verifyJWT } from "../middlewares/auth.middlewares.js";
import { exportTaskReport, exportUsersTaskReport } from "../controllers/reports.controllers.js";


const router = Router()

// Task Management Routes
router.route("/export/tasks").get(verifyJWT, adminOnly, exportTaskReport);
router.route("/export/users").get(verifyJWT, adminOnly, exportUsersTaskReport);

export default router