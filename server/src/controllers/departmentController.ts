import { Request, Response } from "express";
import prisma from '../config/prisma'






export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                students: true,
                courses: true,
            },
        });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};





export const getDepartmentById = async (req: Request, res: Response) => {
    const { id } = req.params; //Destructuring


    try {
        const department = await prisma.department.findUnique({
            where: { id: parseInt(id) },
            include: {
                students: true,
                courses: true,
            },
        });
        if (!department) {
            res.status(404).json({ error: "Department not found" });
            return;
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};




export const createDepartment = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const newDepartment = await prisma.department.create({
            data: { name },
        });
        res.status(201).json({newDepartment,
            message: "Department created successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create department" });
    }
};



export const updateDepartment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedDepartment = await prisma.department.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ error: "Failed to update department" });
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.department.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send({message: "Department deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: "Failed to delete department" });
    }
};
