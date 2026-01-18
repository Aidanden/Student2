import { Router } from "express";
import {
    getEnrollment,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
} from "../controllers/enrollmentController";

const router = Router();

router.get("/", getEnrollment);
router.get("/:id", getEnrollmentById);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

export default router;
