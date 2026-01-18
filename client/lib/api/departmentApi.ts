// Department API Service
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/departments` || "http://localhost:7000/departments";




export const departmentApi = {
    // Get all departments
    async getAll(): Promise<Department[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("فشل في جلب البيانات");
        }
        return response.json();
    },


    // Get department by ID
    async getById(id: number): Promise<Department> {  //Return Type Annotation
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("فشل في جلب القسم");
        }
        return response.json();
    },

    // Create new department
    async create(data: CreateDepartmentDto): Promise<Department> {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في إضافة القسم");
        }
        const result = await response.json();
        return result.newDepartment || result;
    },

    // Update department
    async update(id: number, data: UpdateDepartmentDto): Promise<Department> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("فشل في تحديث القسم");
        }
        return response.json();
    },

    // Delete department
    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("فشل في حذف القسم");
        }
    },
};


