import { Router } from "express";
import {
    createPermission,
    getPermissions,
    CreatePermissionToUser,
    removePermissionFromUser,
    getUserPermissions
} from "../controllers/permissionController";
import { verifyToken, checkPermission } from "../middlewares/authMiddleware";

const router = Router();

// Protect all permission routes - Only those with MANAGE_PERMISSIONS can access (Optional, but good practice)
// router.use(verifyToken, checkPermission("MANAGE_PERMISSIONS"));

router.post("/", createPermission);
router.get("/", getPermissions);
router.post("/createpermissiontouser", CreatePermissionToUser);
router.delete("/:userId/:permissionId", removePermissionFromUser);
router.get("/user/:userId", getUserPermissions);

export default router;
