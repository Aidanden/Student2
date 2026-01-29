// Student API Service
import { User, CreateUserDto, UpdateUserDto } from "@/types/user.type";
import { authFetch } from "./authFetch";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users` || "http://localhost:5000/users";

export const userApi = {
    // Get all students
    async getAll(): Promise<User[]> {
        const response = await authFetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },

    // Get student by ID
    async getById(id: number): Promise<User> {
        const response = await authFetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب الطالب");
        }
        return response.json();
    },

    // Create new student
    async create(data: CreateUserDto): Promise<User> {
        const response = await authFetch(API_URL, {
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
    async update(id: number, data: UpdateUserDto): Promise<User> {
        const response = await authFetch(`${API_URL}/${id}`, {
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
        const response = await authFetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف الطالب");
        }
    },
};
