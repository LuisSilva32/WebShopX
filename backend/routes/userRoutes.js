import express from "express";
import * as userController from "../controllers/userController.js";
import { isAuth, isAdmin } from "../utils.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, userController.getAllUsers);
router.get("/:id", isAuth, isAdmin, userController.getUserById);
router.put("/:id", isAuth, isAdmin, userController.updateUser);
router.delete("/:id", isAuth, isAdmin, userController.deleteUser);
router.post("/signin", userController.signin);
router.post("/signup", userController.signup);
router.put("/profile/:id", isAuth, userController.updateUserProfile);
router.post("/check-email", userController.checkEmail);

export default router;

