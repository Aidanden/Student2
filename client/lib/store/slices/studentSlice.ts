// Student Redux Slice with Async Thunks
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
    StudentState, 
    Student, 
    CreateStudentDto, 
    UpdateStudentDto 
} from "@/types/student.types";
import { studentApi } from "@/lib/api/studentApi";

// Initial State
const initialState: StudentState = {
    students: [],
    loading: false,
    error: null,
    selectedStudent: null,
};

// Async Thunks
export const fetchStudents = createAsyncThunk(
    "students/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await studentApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchStudentById = createAsyncThunk(
    "students/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await studentApi.getById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createStudent = createAsyncThunk(
    "students/create",
    async (data: CreateStudentDto, { rejectWithValue }) => {
        try {
            const newStudent = await studentApi.create(data);
            return newStudent;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateStudent = createAsyncThunk(
    "students/update",
    async ({ id, data }: { id: number; data: UpdateStudentDto }, { rejectWithValue }) => {
        try {
            const updatedStudent = await studentApi.update(id, data);
            return updatedStudent;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteStudent = createAsyncThunk(
    "students/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await studentApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
            state.selectedStudent = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Students
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Student By ID
        builder
            .addCase(fetchStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Student
        builder
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students.push(action.payload);
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Student
        builder
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.students.findIndex(
                    (student) => student.id === action.payload.id
                );
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Student
        builder
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter(
                    (student) => student.id !== action.payload
                );
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
