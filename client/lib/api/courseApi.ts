// Course API Service
import { Course, CreateCourseDto, UpdateCourseDto } from "@/types/course.types";
import { authFetch } from "./authFetch";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/courses` || "http://localhost:7000/courses";

export const courseApi = {
    // Get all courses
    async getAll(): Promise<Course[]> {
        const response = await authFetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get course by ID
    async getById(id: number): Promise<Course> {
        const response = await authFetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب المادة");
        }
        return response.json();
    },

    // Create new course
    async create(data: CreateCourseDto): Promise<Course> {
        const response = await authFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة المادة");
        }
        return response.json();
    },

    // Update course
    async update(id: number, data: UpdateCourseDto): Promise<Course> {
        const response = await authFetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث المادة");
        }
        return response.json();
    },

    // Delete course
    async delete(id: number): Promise<void> {
        const response = await authFetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف المادة");
        }
    },
};
