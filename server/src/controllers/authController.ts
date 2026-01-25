import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/app.config";

const JWT_SECRET = config.jwtSecret;

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
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

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
