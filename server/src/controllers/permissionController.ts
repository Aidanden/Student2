import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createPermission = async (req: Request, res: Response) => {
    const { name, code } = req.body;
    try {
        const permission = await prisma.permission.create({
            data: { name, code },
        });
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ error: "Failed to create permission" });
    }
};

export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await prisma.permission.findMany();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch permissions" });
    }
};

export const CreatePermissionToUser = async (req: Request, res: Response) => {
    const { userId, permissionId } = req.body;
    try {
        const userPermission = await prisma.userPermission.create({
            data: {
                userId: parseInt(userId),
                permissionId: parseInt(permissionId),
            },
        });
        res.status(201).json(userPermission);
    } catch (error) {
        res.status(500).json({ error: "Failed to assign permission" });
    }
};

export const removePermissionFromUser = async (req: Request, res: Response) => {
    const { userId, permissionId } = req.params;
    try {
        await prisma.userPermission.delete({
            where: {
                userId_permissionId: {
                    userId: parseInt(userId),
                    permissionId: parseInt(permissionId),
                },
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to remove permission" });
    }
};

export const getUserPermissions = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const permissions = await prisma.userPermission.findMany({
            where: { userId: parseInt(userId) },
            include: { permission: true },
        });
        res.status(200).json(permissions.map(p => p.permission));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user permissions" });
    }
};
