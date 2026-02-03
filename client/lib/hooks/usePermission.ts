import { useAppSelector } from "@/lib/store/hooks";

/**
 * التحقق من صلاحية المستخدم الحالي
 * إذا لم يكن هناك مستخدم أو لا توجد صلاحيات، يُرجع false
 */
export function usePermission(permissionCode: string): boolean {
    const user = useAppSelector((state) => state.auth.user);
    const permissions = user?.permissions ?? [];
    return permissions.includes(permissionCode);
}

/**
 * التحقق من وجود أي صلاحية من القائمة
 */
export function useHasAnyPermission(codes: string[]): boolean {
    const user = useAppSelector((state) => state.auth.user);
    const permissions = user?.permissions ?? [];
    return codes.some((code) => permissions.includes(code));
}
