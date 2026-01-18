// Student Types & Interfaces
import { Department } from "./department.types";
import { Enrollment } from "./enrollment.types";


export interface Student {
    id: number;
    name: string;
    email: string;
    deptId: number;
    department?: Department;
    enrollments?: Enrollment[];
}

export interface StudentState {
    students: Student[];
    loading: boolean;
    error: string | null;
    selectedStudent: Student | null;
}

// Data Transfer Objects
export interface CreateStudentDto {
    name: string;
    email: string;
    deptId: number;
}

export interface UpdateStudentDto {
    name: string;
    email: string;
    deptId: number;
}