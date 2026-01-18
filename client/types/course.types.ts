import { Enrollment } from "./enrollment.types";
import { Department } from "./department.types";

export interface Course {
    id: number;
    title: string;
    credits: number;
    deptId: number;
}

