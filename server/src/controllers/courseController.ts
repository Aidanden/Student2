import { Request, Response } from "express";
import prisma from '../config/prisma'






export const getCourse = async (req: Request, res: Response) => {
    try {
        const Courses = await prisma.course.findMany({
            include: {
                enrollments: true     
                   },
        });
        res.status(200).json(Courses);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};





export const getCoursesById = async (req: Request, res: Response) => {
    const { id } = req.params; //Destructuring


    try {
        const Courses = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: {
                enrollments: true     

            },
        });
        if (!Courses) {
            res.status(404).json({ error: "Courses not found" });
            return;
        }
        res.status(200).json(Courses);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
};




export const createCourse = async (req: Request, res: Response) => {
    const { title, credits, deptId } = req.body;
    try {
        const newCourse = await prisma.course.create({
            data: { title, credits, deptId},
        });
        res.status(201).json({newCourse,
            message: "Course created successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create Course" });
    }
};



export const updateCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, credits, deptId } = req.body;
    try {
        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(id) },
            data: { title, credits, deptId },
        });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: "Failed to update Course" });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.course.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Course" });
    }
};
