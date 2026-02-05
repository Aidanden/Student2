import { Permission, CreatePermissionDto, AssignPermissionDto } 
from "@/types/permission.types";
import { authFetch } from "./authFetch";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/permissions` 
|| "http://localhost:5000/permissions";

export const permissionApi = {
    async getAll(): Promise<Permission[]> {
        const response = await authFetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب الصلاحيات");
        }
        return response.json();
    },

    async create(data: CreatePermissionDto): Promise<Permission> {
        const response = await authFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة الصلاحية");
        }
        return response.json();
    },

    async getUserPermissions(userId: number): Promise<Permission[]> {
        const response = await authFetch(`${API_URL}/user/${userId}`);
        if (!response.ok) {
            throw new Error("فشل في جلب صلاحيات المستخدم");
        }
        return response.json();
    },

    async assignToUser(data: AssignPermissionDto): Promise<void> {
const response = await authFetch(`${API_URL}/createpermissiontouser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تعيين الصلاحية للمستخدم");
        }
    },

    async removeFromUser(userId: number, permissionId: number): Promise<void> {
        const response = await authFetch(`${API_URL}/${userId}/${permissionId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في إزالة الصلاحية من المستخدم");
        }
    },
};
