import { Router } from "express";
import { adminOnly, verifyJWT } from "../middlewares/auth.middlewares.js";
import { getDashboardData, getTaskById, getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getUserDashboardData } from "../controllers/task.controllers.js";

const router = Router()

// Task Management Routes
router.route("/dashboard-data").get(verifyJWT, getDashboardData); // 
router.route("/user-dashboard-data").get(verifyJWT, getUserDashboardData);
router.route("/").get(verifyJWT, getTasks);
router.route("/:id").get(verifyJWT, getTaskById);
router.route("/").post(verifyJWT, adminOnly, createTask);
router.route("/:id").put(verifyJWT, updateTask);
router.route("/:id").delete(verifyJWT, deleteTask);
router.route("/:id/status").put(verifyJWT, updateTaskStatus);
router.route("/:id/todo").put(verifyJWT, updateTaskChecklist);


export default router