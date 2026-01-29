import { Router } from "express";
import { login, register, getUsers, getUserById, updateUser, deleteUser } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
