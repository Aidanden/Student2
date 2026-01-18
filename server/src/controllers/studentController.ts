import { Request, Response } from "express";
import prisma from '../config/prisma'






export const getStudent = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                enrollments: true     
                   },
        });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};





export const getStudentById = async (req: Request, res: Response) => {
    const { id } = req.params; //Destructuring


    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id) },
            include: {
                enrollments: true     

            },
        });
        if (!student) {
            res.status(404).json({ error: "Student not found" });
            return;
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};




export const createStudent = async (req: Request, res: Response) => {
    const { name, email, deptId } = req.body;
    try {
        const newStudent = await prisma.student.create({
            data: { name, email, deptId},
        });
        res.status(201).json({newStudent,
            message: "Student created successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create Student" });
    }
};



export const updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, deptId } = req.body;
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(id) },
            data: { name, email, deptId },
        });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: "Failed to update Student" });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.student.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Student" });
    }
};
