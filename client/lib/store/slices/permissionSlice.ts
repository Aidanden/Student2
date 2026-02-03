import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    PermissionState,
    Permission,
    CreatePermissionDto,
    AssignPermissionDto,
} from "@/types/permission.types";
import { permissionApi } from "@/lib/api/permissionApi";

const initialState: PermissionState = {
    permissions: [],
    userPermissions: [],
    loading: false,
    error: null,
};

export const fetchPermissions = createAsyncThunk(
    "permissions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await permissionApi.getAll();
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const createPermission = createAsyncThunk(
    "permissions/create",
    async (data: CreatePermissionDto, { rejectWithValue }) => {
        try {
            return await permissionApi.create(data);
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchUserPermissions = createAsyncThunk(
    "permissions/fetchUserPermissions",
    async (userId: number, { rejectWithValue }) => {
        try {
            return await permissionApi.getUserPermissions(userId);
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const assignPermissionToUser = createAsyncThunk(
    "permissions/assignToUser",
    async (data: AssignPermissionDto, { rejectWithValue }) => {
        try {
            await permissionApi.assignToUser(data);
            return data.userId;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const removePermissionFromUser = createAsyncThunk(
    "permissions/removeFromUser",
    async (
        { userId, permissionId }: { userId: number; permissionId: number },
        { rejectWithValue }
    ) => {
        try {
            await permissionApi.removeFromUser(userId, permissionId);
            return { userId, permissionId };
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const permissionSlice = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUserPermissions: (state) => {
            state.userPermissions = [];
        },
    },
    extraReducers: (builder) => {
        // Fetch All Permissions
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions = action.payload;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Permission
        builder
            .addCase(createPermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions.push(action.payload);
            })
            .addCase(createPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch User Permissions
        builder
            .addCase(fetchUserPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.userPermissions = action.payload;
            })
            .addCase(fetchUserPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Assign Permission To User
        builder
            .addCase(assignPermissionToUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignPermissionToUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(assignPermissionToUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Remove Permission From User
        builder
            .addCase(removePermissionFromUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removePermissionFromUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userPermissions = state.userPermissions.filter(
                        (p) => p.id !== action.payload!.permissionId
                    );
                }
            })
            .addCase(removePermissionFromUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearUserPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
