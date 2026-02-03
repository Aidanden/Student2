export interface Permission {
    id: number;
    name: string;
    code: string;
}

export interface PermissionState {
    permissions: Permission[];
    userPermissions: Permission[]; // permissions for selected user
    loading: boolean;
    error: string | null;
}

export interface CreatePermissionDto {
    name: string;
    code: string;
}

export interface AssignPermissionDto {
    userId: number;
    permissionId: number;
}
