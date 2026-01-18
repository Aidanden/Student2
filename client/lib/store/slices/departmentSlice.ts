// Department Redux Slice with Async Thunks
// reducer how to update the state
//slice (reducer , status , actions)
//createAsyncThunk fix issue redux toolkit cannot be async with fetch data
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
    DepartmentState, 
    Department, 
    CreateDepartmentDto, 
    UpdateDepartmentDto 
} from "@/types/department.types";
import { departmentApi } from "@/lib/api/departmentApi";

// Initial State
const initialState: DepartmentState = {
    departments: [],
    loading: false,
    error: null,
    selectedDepartment: null,
};
export const fetchDepartments = createAsyncThunk(
    "departments/fetchAll",
    async (_, { rejectWithValue }) => { // _ is the payload (not used) , { rejectWithValue } is the options (ThunkAPI) - (rejectWithValue) is used to handle errors
        try {
            const data = await departmentApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchDepartmentById = createAsyncThunk(
    "departments/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await departmentApi.getById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    "departments/create",
    async (data: CreateDepartmentDto, { rejectWithValue }) => {
        try {
            const newDepartment = await departmentApi.create(data);
            return newDepartment;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    "departments/update",
    async ({ id, data }: { id: number; data: UpdateDepartmentDto }, { rejectWithValue }) => {
        try {
            const updatedDepartment = await departmentApi.update(id, data);
            return updatedDepartment;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    "departments/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await departmentApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const departmentSlice = createSlice({
    name: "departments",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        setSelectedDepartment: (state, action: PayloadAction<Department | null>) => {
            state.selectedDepartment = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Departments
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Department By ID
        builder
            .addCase(fetchDepartmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedDepartment = action.payload;
            })
            .addCase(fetchDepartmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Department
        builder
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Department
        builder
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.departments.findIndex(
                    (dept) => dept.id === action.payload.id
                );
                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Department
        builder
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = state.departments.filter(
                    (dept) => dept.id !== action.payload
                );
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;


