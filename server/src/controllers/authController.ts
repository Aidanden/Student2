import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/app.config";

const JWT_SECRET = config.jwtSecret;

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            res.status(409).json({ error: "Username already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                exist: true
            },
        });
        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Failed to register user" });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                username,
                exist: true
            },
        });

        if (!user) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const sessionId = crypto.randomBytes(16).toString("hex");

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                sid: sessionId
            },
            String(JWT_SECRET),
            {
                expiresIn: "24h",
            }
        );

        /// permissions
        const userWithPermissions = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
//-----------------------------------------------------
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                permissions: userWithPermissions?.permissions.map(p => p.permission.code) || []
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};


export const getUsers = async (req: Request, res: Response) => {
    try {
        const Users = await prisma.user.findMany({
            where: { exist: true },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        res.status(200).json(Users);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};



export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params; //Destructuring


    try {
        const User = await prisma.user.findFirst({
            where: {
                id: parseInt(id),
                exist: true
            },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        if (!User) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { username, password: hashedPassword },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update User" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.update({
            where: { id: parseInt(id) },
            data: { exist: false },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Course" });
    }
};
