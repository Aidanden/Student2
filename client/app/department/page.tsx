"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { usePermission } from "@/lib/hooks/usePermission";
import { PERMISSIONS } from "@/lib/constants/permissions";
import {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
} from "@/lib/store/slices/departmentSlice";
import { Department } from "@/types/department.types";

export default function DepartmentPage() {
    const dispatch = useAppDispatch();
    const { departments, loading, error } = useAppSelector((state) => state.departments);
    const canView = usePermission(PERMISSIONS.DEPARTMENTS_VIEW);
    const canCreate = usePermission(PERMISSIONS.DEPARTMENTS_CREATE);
    const canUpdate = usePermission(PERMISSIONS.DEPARTMENTS_UPDATE);
    const canDelete = usePermission(PERMISSIONS.DEPARTMENTS_DELETE);

    // Local UI State
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Fetch departments on mount
    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    // Handlers
    const handleAddDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) {
            alert("الرجاء إدخال اسم القسم");
            return;
        }

        try {
            await dispatch(createDepartment({ name: newName })).unwrap();
            setNewName("");
            alert(" تم إضافة القسم بنجاح!");
        } catch (err: any) {
            alert(" فشل إضافة القسم " + err);
        }
    };

    const handleUpdateDepartment = async (id: number) => {
        if (!editName.trim()) {
            alert("الرجاء إدخال اسم القسم");
            return;
        }

        try {
            await dispatch(updateDepartment({ id, data: { name: editName } })).unwrap();
            setEditingId(null);
            setEditName("");
            alert(" تم تحديث القسم بنجاح!");
        } catch (err: any) {
            alert(" فشل تحديث القسم " + err);
        }
    };

    const handleDeleteDepartment = async (id: number) => {
        if (!confirm(" هل أنت متأكد من حذف هذا القسم؟")) return;

        try {
            await dispatch(deleteDepartment(id)).unwrap();
            alert(" تم حذف القسم بنجاح!");
        } catch (err: any) {
            alert(" " + err);
        }
    };

    const startEdit = (dept: Department) => {
        setEditingId(dept.id);
        setEditName(dept.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
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
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-xl">
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">إدارة الأقسام</h1>
                    <Link 
                        href="/" 
                        className="px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium transition-all"
                    >
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Add Form */}
                {canCreate && (
                <form onSubmit={handleAddDepartment} className="p-8 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-slate-200">إضافة قسم جديد</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="اسم القسم (مثال: علوم الحاسوب، الهندسة، الطب)"
                            className="flex-1 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-lg"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            إضافة
                        </button>
                    </div>
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
                                onClick={() => dispatch(fetchDepartments())}
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
                                <span className="font-bold text-blue-400">عدد الأقسام:</span> {departments.length}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
                                >
                                    <div className="p-6">
                                        {editingId === dept.id ? (
                                            <div className="flex gap-3 items-center">
                                                <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                    ID: {dept.id}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-lg"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleUpdateDepartment(dept.id)}
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
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                                                        ID: {dept.id}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                                                    <div className="flex gap-2">
                                                        <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                                                            {dept.students?.length || 0} طالب
                                                        </span>
                                                        <span className="text-sm bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
                                                            {dept.courses?.length || 0} مادة
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(dept.id)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition font-semibold"
                                                    >
                                                        {expandedId === dept.id ? "▲ إخفاء" : "▼ تفاصيل"}
                                                    </button>
                                                    {canUpdate && (
                                                    <button
                                                        onClick={() => startEdit(dept)}
                                                        className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition font-semibold"
                                                    >
                                                        تعديل
                                                    </button>
                                                )}
                                                    {canDelete && (
                                                    <button
                                                        onClick={() => handleDeleteDepartment(dept.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
                                                    >
                                                        حذف
                                                    </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {expandedId === dept.id && (
                                        <div className="border-t border-slate-700 bg-slate-900/40 p-6 space-y-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-200 mb-3">الطلاب المسجلون</h4>
                                                {dept.students && dept.students.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {dept.students.map((student) => (
                                                            <div key={student.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                                                                <p className="font-semibold text-white">{student.name}</p>
                                                                <p className="text-sm text-slate-400">{student.email}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 italic">لا يوجد طلاب مسجلون في هذا القسم</p>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-200 mb-3">المواد الدراسية</h4>
                                                {dept.courses && dept.courses.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {dept.courses.map((course) => (
                                                            <div key={course.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                                                                <p className="font-semibold text-white">{course.title}</p>
                                                                <p className="text-sm text-slate-400">الساعات: {course.credits}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 italic">لا توجد مواد دراسية في هذا القسم</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {departments.length === 0 && (
                                <div className="text-center p-12 bg-slate-800/60 border border-slate-700 rounded-xl">
                                    <p className="text-slate-400 text-lg">لا توجد أقسام بعد. قم بإضافة قسم جديد!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
