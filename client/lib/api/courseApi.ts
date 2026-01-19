// Student API Service
import { Course, CreateCourseDto, UpdateCourseDto }
    from "@/types/course.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/courses`
    || "http://localhost:7000/courses";

export const courseApi = {
    // Get all students
    async getAll(): Promise<Course[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get student by ID
    async getById(id: number): Promise<Course> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب الكورس");
        }
        return response.json();
    },

    // Create new student
    async create(data: CreateCourseDto): Promise<Course> {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة كورس");
        }
        const result = await response.json();
        return result.newCourse || result;
    },

    // Update student
    async update(id: number, data: UpdateCourseDto): Promise<Course> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث الكورس");
        }
        return response.json();
    },

    // Delete student
    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف الكورس");
        }
    },
};
