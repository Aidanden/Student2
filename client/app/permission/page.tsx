"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { usePermission } from "@/lib/hooks/usePermission";
import { PERMISSIONS } from "@/lib/constants/permissions";
import {
    fetchPermissions,
    createPermission,
    fetchUserPermissions,
    assignPermissionToUser,
    removePermissionFromUser,
    clearError,
    clearUserPermissions,
} from "@/lib/store/slices/permissionSlice";
import { fetchUsers } from "@/lib/store/slices/userSlice";

export default function PermissionPage() {
    const dispatch = useAppDispatch();
    const { permissions, userPermissions, loading, error } = useAppSelector(
        (state) => state.permissions
    );
    const { Users } = useAppSelector((state) => state.users);
    const canView = usePermission(PERMISSIONS.PERMISSIONS_VIEW);
    const canCreate = usePermission(PERMISSIONS.PERMISSIONS_CREATE);
    const canAssign = usePermission(PERMISSIONS.PERMISSIONS_ASSIGN);

    const [newName, setNewName] = useState("");
    const [newCode, setNewCode] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [permissionToAdd, setPermissionToAdd] = useState<number | "">("");

    useEffect(() => {
        dispatch(fetchPermissions());
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUserId != null) {
            dispatch(fetchUserPermissions(selectedUserId));
        } else {
            dispatch(clearUserPermissions());
        }
    }, [dispatch, selectedUserId]);

    const handleAddPermission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newCode.trim()) {
            alert("الرجاء إدخال الاسم والكود");
            return;
        }
        try {
            await dispatch(createPermission({ name: newName, code: newCode })).unwrap();
            setNewName("");
            setNewCode("");
            alert("تم إضافة الصلاحية بنجاح!");
        } catch (err: unknown) {
            alert("فشل إضافة الصلاحية: " + (err as string));
        }
    };

    const handleAssignToUser = async () => {
        if (selectedUserId == null || permissionToAdd === "") {
            alert("الرجاء اختيار مستخدم وصلاحية");
            return;
        }
        try {
            await dispatch(
                assignPermissionToUser({
                    userId: selectedUserId,
                    permissionId: Number(permissionToAdd),
                })
            ).unwrap();
            setPermissionToAdd("");
            dispatch(fetchUserPermissions(selectedUserId));
            alert("تم تعيين الصلاحية بنجاح!");
        } catch (err: unknown) {
            alert("فشل تعيين الصلاحية: " + (err as string));
        }
    };

    const handleRemoveFromUser = async (permissionId: number) => {
        if (selectedUserId == null) return;
        if (!confirm("هل أنت متأكد من إزالة هذه الصلاحية؟")) return;
        try {
            await dispatch(
                removePermissionFromUser({ userId: selectedUserId, permissionId })
            ).unwrap();
            alert("تم إزالة الصلاحية بنجاح!");
        } catch (err: unknown) {
            alert("فشل إزالة الصلاحية: " + (err as string));
        }
    };

    const assignedIds = new Set(userPermissions.map((p) => p.id));
    const availableToAssign = permissions.filter((p) => !assignedIds.has(p.id));

    if (!canView) {
        return (
            <div className="min-h-[calc(100vh-64px)] p-6 flex items-center justify-center">
                <div className="text-center p-8 bg-slate-800/60 border border-slate-700 rounded-xl">
                    <p className="text-red-300 text-lg">ليس لديك صلاحية لعرض هذه الصفحة.</p>
                    <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-xl bg-slate-600 text-white hover:bg-slate-500">
                        الرجوع للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-xl">
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
                        إدارة الصلاحيات وصلاحيات المستخدم
                    </h1>
                    <Link
                        href="/"
                        className="px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium transition-all"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-xl flex justify-between items-center">
                        <p className="text-red-300">{error}</p>
                        <button
                            onClick={() => dispatch(clearError())}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                        >
                            إغلاق
                        </button>
                    </div>
                )}

                {/* إدارة الصلاحيات (Permission) */}
                {canCreate && (
                <form
                    onSubmit={handleAddPermission}
                    className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl"
                >
                    <h2 className="text-xl font-bold mb-6 text-slate-200">
                        إضافة صلاحية جديدة
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="اسم الصلاحية (مثال: عرض لوحة التحكم)"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                        <input
                            type="text"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            placeholder="كود الصلاحية (مثال: VIEW_DASHBOARD)"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50"
                    >
                        إضافة صلاحية
                    </button>
                </form>
                )}

                {/* قائمة الصلاحيات */}
                <div className="p-6 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-200">
                        جميع الصلاحيات ({permissions.length})
                    </h2>
                    {loading && permissions.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-600 border-t-blue-500" />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((p) => (
                                <span
                                    key={p.id}
                                    className="px-3 py-1.5 bg-slate-700/80 text-slate-200 rounded-lg text-sm font-mono"
                                >
                                    {p.name} ({p.code})
                                </span>
                            ))}
                            {permissions.length === 0 && (
                                <p className="text-slate-400">لا توجد صلاحيات. أضف صلاحية جديدة أعلاه.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* صلاحيات المستخدم (UserPermission) */}
                {canAssign && (
                <div className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-200">
                        صلاحيات المستخدم
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-2">
                                اختر المستخدم
                            </label>
                            <select
                                value={selectedUserId ?? ""}
                                onChange={(e) =>
                                    setSelectedUserId(
                                        e.target.value === ""
                                            ? null
                                            : Number(e.target.value)
                                    )
                                }
                                className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- اختر مستخدم --</option>
                                {Users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.username} (ID: {u.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedUserId != null && (
                            <>
                                <div className="flex flex-wrap gap-3 items-end">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-slate-400 mb-2 text-sm">
                                            إضافة صلاحية للمستخدم
                                        </label>
                                        <select
                                            value={permissionToAdd}
                                            onChange={(e) =>
                                                setPermissionToAdd(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value)
                                                )
                                            }
                                            className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">
                                                -- اختر صلاحية --
                                            </option>
                                            {availableToAssign.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.code})
                                                </option>
                                            ))}
                                            {availableToAssign.length === 0 && (
                                                <option value="" disabled>
                                                    المستخدم لديه كل الصلاحيات
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAssignToUser}
                                        disabled={
                                            loading || permissionToAdd === ""
                                        }
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50"
                                    >
                                        تعيين
                                    </button>
                                </div>

                                <div>
                                    <p className="text-slate-400 mb-2">
                                        صلاحيات هذا المستخدم:
                                    </p>
                                    {loading && userPermissions.length === 0 ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-blue-500" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {userPermissions.map((p) => (
                                                <span
                                                    key={p.id}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700/80 text-slate-200 rounded-lg text-sm"
                                                >
                                                    {p.name} ({p.code})
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveFromUser(
                                                                p.id
                                                            )
                                                        }
                                                        className="text-red-400 hover:text-red-300"
                                                        title="إزالة"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                            {userPermissions.length === 0 && (
                                                <p className="text-slate-500">
                                                    لا توجد صلاحيات معينة لهذا المستخدم.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
