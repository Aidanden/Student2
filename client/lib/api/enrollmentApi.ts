// Enrollment API Service
import { Enrollment, CreateEnrollmentDto, UpdateEnrollmentDto } from "@/types/enrollment.types";
import { authFetch } from "./authFetch";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/enrollments` || "http://localhost:7000/enrollments";

export const enrollmentApi = {
    // Get all enrollments
    async getAll(): Promise<Enrollment[]> {
        const response = await authFetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get enrollment by ID
    async getById(id: number): Promise<Enrollment> {
        const response = await authFetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب التسجيل");
        }
        return response.json();
    },

    // Create new enrollment
    async create(data: CreateEnrollmentDto): Promise<Enrollment> {
        const response = await authFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة التسجيل");
        }
        return response.json();
    },

    // Update enrollment
    async update(id: number, data: UpdateEnrollmentDto): Promise<Enrollment> {
        const response = await authFetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث التسجيل");
        }
        return response.json();
    },

    // Delete enrollment
    async delete(id: number): Promise<void> {
        const response = await authFetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف التسجيل");
        }
    },
};
