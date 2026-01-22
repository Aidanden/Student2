// Student Redux Slice with Async Thunks
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    CourseState,
    Course,
    CreateCourseDto,
    UpdateCourseDto
} from "@/types/course.types";
import { courseApi } from "@/lib/api/courseApi";


// Initial State
const initialState: CourseState = {
    Courses: [],
    loading: false,
    error: null,
    selectedCourse: null,
};

// Async Thunks
export const fetchCourses = createAsyncThunk(
    "courses/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await courseApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    "courses/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await courseApi.getById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCourse = createAsyncThunk(
    "courses/create",
    async (data: CreateCourseDto, { rejectWithValue }) => {
        try {
            const newCourse = await courseApi.create(data);
            return newCourse;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCourse = createAsyncThunk(
    "courses/update",
    async ({ id, data }: { id: number; data: UpdateCourseDto }, { rejectWithValue }) => {
        try {
            const updatedCourse = await courseApi.update(id, data);
            return updatedCourse;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCourse = createAsyncThunk(
    "courses/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await courseApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
            state.selectedCourse = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Courses
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.Courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Course By ID
        builder
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Course
        builder
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.Courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Course
        builder
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.Courses.findIndex(
                    (course) => course.id === action.payload.id
                );
                if (index !== -1) {
                    state.Courses[index] = action.payload;
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Course
        builder
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.Courses = state.Courses.filter(
                    (course) => course.id !== action.payload
                );
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
