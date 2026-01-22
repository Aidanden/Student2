// Student Redux Slice with Async Thunks
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    EnrollmentState,
    Enrollment,
    CreateEnrollmentDto,
    UpdateEnrollmentDto
} from "@/types/enrollment.types";
import { enrollmentApi } from "@/lib/api/enrollmentApi";


// Initial State
const initialState: EnrollmentState = {
    enrollment: [],
    loading: false,
    error: null,
    selectedEnrollment: null,
};

// Async Thunks
export const fetchEnrollment = createAsyncThunk(
    "enrollment/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await enrollmentApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEnrollmentById = createAsyncThunk(
    "enrollment/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await enrollmentApi.getById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createEnrollment = createAsyncThunk(
    "enrollment/create",
    async (data: CreateEnrollmentDto, { rejectWithValue }) => {
        try {
            const newEnrollment = await enrollmentApi.create(data);
            return newEnrollment;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const UpdateEnrollment = createAsyncThunk(
    "enrollment/update",
    async ({ id, data }: { id: number; data: UpdateEnrollmentDto }, { rejectWithValue }) => {
        try {
            const UpdateEnrollment = await enrollmentApi.update(id, data);
            return UpdateEnrollment;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEnrollment = createAsyncThunk(
    "enrollment/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await enrollmentApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        setSelectedEnrollment: (state, action: PayloadAction<Enrollment | null>) => {
            state.selectedEnrollment = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Courses
        builder
            .addCase(fetchEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollment = action.payload;
            })
            .addCase(fetchEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Course By ID
        builder
            .addCase(fetchEnrollmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEnrollment = action.payload;
            })
            .addCase(fetchEnrollmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Course
        builder
            .addCase(createEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollment.push(action.payload);
            })
            .addCase(createEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Course
        builder
            .addCase(UpdateEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.enrollment.findIndex(
                    (enrollment) => enrollment.id === action.payload.id
                );
                if (index !== -1) {
                    state.enrollment[index] = action.payload;
                }
            })
            .addCase(UpdateEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Course
        builder
            .addCase(deleteEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollment = state.enrollment.filter(
                    (enrollment) => enrollment.id !== action.payload
                );
            })
            .addCase(deleteEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedEnrollment } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
