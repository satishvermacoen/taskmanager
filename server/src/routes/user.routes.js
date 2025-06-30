import { Router } from "express";
import { verifyJWT, adminOnly } from "../middlewares/auth.middlewares.js";
import { deleteUser, getUserById, getUsers } from "../controllers/users.controllers.js";




const router = Router()

// Secured routes (require JWT authentication)
router.route("/").get(verifyJWT, adminOnly, getUsers);


router.route("/:id").get(verifyJWT, getUserById);
router.route("/:id").delete(verifyJWT, adminOnly, deleteUser);




export default router