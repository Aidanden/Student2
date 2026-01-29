// Student Redux Slice with Async Thunks
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    UserState,
    User,
    CreateUserDto,
    UpdateUserDto
} from "@/types/user.type";
import { userApi } from "@/lib/api/userApi";


// Initial State
const initialState: UserState = {
    Users: [],
    loading: false,
    error: null,
    selectedUser: null,
};

// Async Thunks
export const fetchUsers = createAsyncThunk(
    "users/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await userApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "users/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await userApi.getById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createUser = createAsyncThunk(
    "users/create",
    async (data: CreateUserDto, { rejectWithValue }) => {
        try {
            const newUser = await userApi.create(data);
            return newUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ id, data }: { id: number; data: UpdateUserDto }, { rejectWithValue }) => {
        try {
            const updatedUser = await userApi.update(id, data);
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await userApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.Users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch User By ID
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create User
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.Users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update User
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.Users.findIndex(
                    (user) => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.Users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete User
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.Users = state.Users.filter(
                    (user) => user.id !== action.payload
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
