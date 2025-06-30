import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword } from "../controllers/authuser.controllers.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middlewares.js";
import { getUserProfiletUser } from "../controllers/authuser.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const router = Router()

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// Secured routes (require JWT authentication)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getUserProfiletUser);
router.route("/change-password").put(verifyJWT, changeCurrentPassword);

// File upload 
router.route("/upload-image").post(upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({message: "No file uploaded"})
        
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});


export default router