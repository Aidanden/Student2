import { Router } from "express";
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../controllers/departmentController";

import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Protect all routes
router.use(verifyToken);

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
