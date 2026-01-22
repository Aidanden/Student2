// Student API Service
import { Enrollment, CreateEnrollmentDto, UpdateEnrollmentDto }from "@/types/enrollment.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/enrollments`
    || "http://localhost:7000/enrollments";

export const enrollmentApi = {
    // Get all students
    async getAll(): Promise<Enrollment[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get student by ID
    async getById(id: number): Promise<Enrollment> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في العملية");
        }
        return response.json();
    },

    // Create new student
    async create(data: CreateEnrollmentDto): Promise<Enrollment> {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة ");
        }
        const result = await response.json();
        return result.newEnrollment || result;
    },

    // Update student
    async update(id: number, data: UpdateEnrollmentDto): Promise<Enrollment> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث ");
        }
        return response.json();
    },

    // Delete student
    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في الحذف ");
        }
    },
};
