// Auth API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AUTH_URL = `${API_BASE_URL}/users`;

export interface LoginData {
    username: string;
    password: string;
}


export interface AuthResponse {
    message: string;
    token: string;
    user: {
        id: number;
        username: string;
        permissions?: string[];
    };
}

export const authApi = {
    // Login
    async login(loginData: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "فشل في تسجيل الدخول");
        }

        return data;
    },

};
