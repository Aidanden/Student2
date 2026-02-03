"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { usePermission } from "@/lib/hooks/usePermission";
import { PERMISSIONS } from "@/lib/constants/permissions";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
} from "@/lib/store/slices/userSlice";
import { User } from "@/types/user.type";

export default function UserPage() {
    const dispatch = useAppDispatch();
    const { Users, loading, error } = useAppSelector((state) => state.users);
    const canView = usePermission(PERMISSIONS.USERS_VIEW);
    const canCreate = usePermission(PERMISSIONS.USERS_CREATE);
    const canUpdate = usePermission(PERMISSIONS.USERS_UPDATE);
    const canDelete = usePermission(PERMISSIONS.USERS_DELETE);

    // Local UI State
    const [newUserName, setNewUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editUserName, setEditUserName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch students and departments on mount


    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);


    // Handlers
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim()) {
            alert("الرجاء إدخال اسم المستخدم");
            return;
        }
        if (!newPassword.trim()) {
            alert("الرجاء إدخال كلمة المرور");
            return;
        }


        try {
            await dispatch(
                createUser({
                    username: newUserName,
                    password: newPassword,
                })
            ).unwrap();
            setNewUserName("");
            setNewPassword("");
            alert("تم إضافة المستخدم بنجاح!");
        } catch (err: any) {
            alert("فشل إضافة المستخدم: " + err);
        }
    };

    const handleUpdateUser = async (id: number) => {
        if (!editUserName.trim()) {
            alert("الرجاء إدخال اسم المستخدم");
            return;
        }
        if (!editPassword.trim()) {
            alert("الرجاء إدخال كلمة المرور");
            return;
        }


        try {
            await dispatch(
                updateUser({
                    id,
                    data: {
                        username: editUserName,
                        password: editPassword,
                    }
                })
            ).unwrap();
            setEditingId(null);
            setEditUserName("");
            setEditPassword("");
            alert("تم تحديث المستخدم بنجاح!");
        } catch (err: any) {
            alert("فشل تحديث المستخدم: " + err);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

        try {
            await dispatch(deleteUser(id)).unwrap();
            alert("تم حذف المستخدم بنجاح!");
        } catch (err: any) {
            alert("فشل حذف المستخدم: " + err);
        }
    };

    const startEdit = (user: User) => {
        setEditingId(user.id);
        setEditUserName(user.username);
        setEditPassword(user.password);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditUserName("");
        setEditPassword("");
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleClearError = () => {
        dispatch(clearError());
    };



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
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">إدارة المستخدمين</h1>
                    <Link
                        href="/"
                        className="px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium transition-all"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {canCreate && (
                <form onSubmit={handleAddUser} className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-200">إضافة مستخدم جديد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="اسم المستخدم"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        إضافة
                    </button>
                </form>
                )}

                {/* Loading/Error States */}
                {loading ? (
                    <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500 mb-4"></div>
                        <p className="text-slate-400 text-lg">جاري تحميل البيانات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-900/20 border border-red-700/50 rounded-xl">
                        <p className="text-red-300 text-lg font-semibold">خطأ: {error}</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button
                                onClick={() => dispatch(fetchUsers())}
                                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-500 transition"
                            >
                                إعادة المحاولة
                            </button>
                            <button
                                onClick={handleClearError}
                                className="bg-slate-600 text-white px-6 py-2 rounded-xl hover:bg-slate-500 transition"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
                            <p className="text-slate-300 text-lg">
                                <span className="font-bold text-blue-400">عدد المستخدمين:</span> {Users.length}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {Users.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
                                >
                                    <div className="p-6">
                                        {editingId === user.id ? (
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {user.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editUserName}
                                                        onChange={(e) => setEditUserName(e.target.value)}
                                                        placeholder="اسم المستخدم"
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="password"
                                                        value={editPassword}
                                                        onChange={(e) => setEditPassword(e.target.value)}
                                                        placeholder="كلمة المرور"
                                                        className="p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    />
                                                </div>
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateUser(user.id)}
                                                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 transition font-semibold"
                                                    >
                                                        ✓ حفظ
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-500 transition font-semibold"
                                                    >
                                                        ✕ إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {user.id}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{user.username}</h3>
                                                        <p className="text-slate-400 text-sm">••••••••</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {canUpdate && (
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    )}
                                                    {canDelete && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {Users.length === 0 && (
                                <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                                    <p className="text-slate-400 text-lg">لا يوجد مستخدمون بعد. قم بإضافة مستخدم جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
