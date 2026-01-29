
export interface User {
    id: number;
    username: string;
    password: string;
    exist: boolean;
}

export interface UserState {
    Users: User[];
    loading: boolean;
    error: string | null;
    selectedUser: User | null;
}

// Data Transfer Objects
export interface CreateUserDto {
    username: string;
    password: string;
}

export interface UpdateUserDto {
    username: string;
    password: string;
}