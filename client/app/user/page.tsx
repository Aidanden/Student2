"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
} from "@/lib/store/slices/userSlice";
import { User } from "@/types/user.type";

export default function StudentPage() {
    // Redux State
    const dispatch = useAppDispatch();
    const { Users, loading, error } = useAppSelector((state) => state.users);

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



    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold text-teal-900 mb-2">إدارة المستخدم</h1>
                    </div>
                    <Link
                        href="/"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-1 shadow-md"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddUser} className="mb-8 p-8 bg-white rounded-xl shadow-lg border-2 border-teal-100">
                    <h2 className="text-2xl font-bold mb-6 text-teal-800 flex items-center gap-2">
                        إضافة مستخدم جديد
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="اسم المستخدم"
                            className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                        />

                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700 transition-all transform hover:-translate-y-1 shadow-md font-bold text-lg"
                    >
                        إضافة
                    </button>
                </form>

                {/* Loading/Error States */}
                {loading ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
                        <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-50 rounded-xl shadow-lg border-2 border-red-200">
                        <p className="text-red-600 text-lg font-semibold">خطأ: {error}</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button
                                onClick={() => dispatch(fetchUsers())}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                إعادة المحاولة
                            </button>
                            <button
                                onClick={handleClearError}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Statistics */}
                        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-teal-600">عدد المستخدمين:</span> {Users.length}
                            </p>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4">
                            {Users.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Student Header */}
                                    <div className="p-6">
                                        {editingId === user.id ? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-center">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {user.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editUserName}
                                                        onChange={(e) => setEditUserName(e.target.value)}
                                                        placeholder="اسم المستخدم"
                                                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="password"
                                                        value={editPassword}
                                                        onChange={(e) => setEditPassword(e.target.value)}
                                                        placeholder="كلمة المرور"
                                                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                                                    />

                                                </div>
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateUser(user.id)}
                                                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                                                    >
                                                        ✓ حفظ
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                                                    >
                                                        ✕ إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-teal-100 text-teal-800 px-3 py-1 rounded">
                                                        ID: {user.id}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
                                                        <p className="text-gray-600">{user.password}</p>
                                                    </div>

                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(user.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                                                    >
                                                        {expandedId === user.id ? "▲ إخفاء التفاصيل" : "▼ عرض التفاصيل"}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}

                                </div>
                            ))}

                            {Users.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                                    <div className="text-6xl mb-4">🎓</div>
                                    <p className="text-gray-600 text-lg">لا يوجد طلاب بعد. قم بإضافة طالب جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
