import { Router } from "express";
import {
    getCourse,
    getCoursesById,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/courseController";

const router = Router();

router.get("/", getCourse);
router.get("/:id", getCoursesById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
