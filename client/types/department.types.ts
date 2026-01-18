// Department Types & Interfaces
import { Student } from "./student.types";
import { Course } from "./course.types";


export interface Department {
    id: number;
    name: string;
    students?: Student[];
    courses?: Course[];
}

export interface DepartmentState {
    departments: Department[];
    loading: boolean;
    error: string | null;
    selectedDepartment: Department | null;
}
///Data Transfer Objects
export interface CreateDepartmentDto {
    name: string;
}

export interface UpdateDepartmentDto {
    name: string;
}

