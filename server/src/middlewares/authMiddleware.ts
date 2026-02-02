import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import prisma from "../config/prisma";

const JWT_SECRET = config.jwtSecret;

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
        [key: string]: any;
    };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, String(JWT_SECRET)) as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

export const checkPermission = (permissionCode: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            const userWithPermissions = await prisma.user.findUnique({
                where: { id: req.user.userId },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });

            if (!userWithPermissions) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const hasPermission = userWithPermissions.permissions.some(
                (p) => p.permission.code === permissionCode
            );

            if (!hasPermission) {
                res.status(403).json({ error: "Access denied: Missing permission " + permissionCode });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };
};
