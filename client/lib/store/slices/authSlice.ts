import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: { id: number; username: string; permissions?: string[] } | null;
    token: string | null;
    isAuthenticated: boolean;
}

const loadUser = () => {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: loadUser(),
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: { id: number; username: string; permissions?: string[] };
                token: string;
            }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
