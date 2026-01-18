// Student API Service
import { Student, CreateStudentDto, UpdateStudentDto } 
from "@/types/student.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/students` 
|| "http://localhost:7000/students";

export const studentApi = {
    // Get all students
    async getAll(): Promise<Student[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get student by ID
    async getById(id: number): Promise<Student> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب الطالب");
        }
        return response.json();
    },

    // Create new student
    async create(data: CreateStudentDto): Promise<Student> {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة الطالب");
        }
        const result = await response.json();
        return result.newStudent || result;
    },

    // Update student
    async update(id: number, data: UpdateStudentDto): Promise<Student> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث الطالب");
        }
        return response.json();
    },

    // Delete student
    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف الطالب");
        }
    },
};
