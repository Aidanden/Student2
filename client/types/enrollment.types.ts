import { Student } from "./student.types";
import { Course } from "./course.types";


export interface Enrollment {
    id: number;
    studentId: number;
    courseId: number;
    grade: number | null;
    student: Student[];
    course: Course[];
}


export interface EnrollmentState {
    enrollment:Enrollment[];
    loading: boolean;
    error: string | null;
    selectedEnrollment: Enrollment | null;
}


export interface CreateEnrollmentDto {
    studentId: number;
    courseId: number;
    grade?: number | null;
}

export interface UpdateEnrollmentDto {
    studentId: number;
    courseId: number;
    grade?: number | null;
}
