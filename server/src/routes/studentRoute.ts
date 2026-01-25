import { Router } from "express";
import {
    getStudent,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController";

import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(verifyToken);

router.get("/", getStudent);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
