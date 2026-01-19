// Course Types & Interfaces
import { Department } from "./department.types";
import { Enrollment } from "./enrollment.types";


export interface Course {
    id: number;
    title: string;
    credits: number;
    deptId: number;
    department?: Department;
    enrollments?: Enrollment[];
}

export interface CourseState {
    Courses: Course[];
    loading: boolean;
    error: string | null;
    selectedCourse: Course | null;
}

// Data Transfer Objects
export interface CreateCourseDto {
    title: string;
    credits: number;
    deptId: number;
}

export interface UpdateCourseDto {
    title: string;
    credits: number;
    deptId: number;
}